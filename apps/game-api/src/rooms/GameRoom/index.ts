import { Room, ServerError, type AuthContext, type Client } from '@colyseus/core';
import { nanoid } from 'nanoid';
import {
  calculateMovement,
  FIXED_TIME_STEP,
  PLAYER_SIZE,
  MAP_SIZE,
  ATTACK_SIZE,
  ATTACK_OFFSET_X,
  ATTACK_OFFSET_Y,
  ATTACK_COOLDOWN,
  ATTACK_DAMAGE__DELAY,
  ATTACK_DAMAGE__FRAME_TIME,
  ENEMY_SPAWN_RATE,
  MAX_ENEMIES,
  ENEMY_SIZE,
  WS_EVENT,
  WS_CODE,
  INACTIVITY_TIMEOUT,
  RECONNECTION_TIMEOUT,
  type AuthPayload,
  type InputPayload,
} from '@repo/core-game';
import type { PrismaClient, Profile } from '../../prisma-client';
import { validateJwt } from '../../auth/jwt';
import { logger } from '../../logger';
import { ROOM_ERROR } from '../error';
import { GameRoomState, Player, Enemy } from './roomState';

const MAX_PLAYERS_PER_ROOM = 4;

/** Basic in-memory storage of results for all players in a room */
export const RESULTS: ResultStorage = {};
interface ResultStorage {
  [roomId: string]: {
    [userId: string]: {
      username: string;
      attackCount: number;
      killCount: number;
    };
  };
}

interface AuthResult {
  user: Profile;
  tokenExpiresAt: number;
}

interface GameRoomArgs {
  prisma: PrismaClient;
  connectionCheckInterval: number;
}

export class GameRoom extends Room<GameRoomState> {
  maxClients = MAX_PLAYERS_PER_ROOM;
  state = new GameRoomState();
  elapsedTime = 0;
  lastEnemySpawnTime = 0;
  prisma: PrismaClient;
  connectionCheckTimeout: NodeJS.Timeout;
  reconnectionTimeout = RECONNECTION_TIMEOUT;
  expectingReconnections = new Set<string>();

  onCreate({ prisma, connectionCheckInterval }: GameRoomArgs) {
    logger.info({
      message: `New room created!`,
      data: { roomId: this.roomId },
    });
    // this is the speed at which we stream updates to the client
    // updates should be interpolated clientside to appear smoother
    this.patchRate = 1000 / 20; // 20fps = 50ms

    this.prisma = prisma;

    this.connectionCheckTimeout = setInterval(() => this.checkPlayerConnection(), connectionCheckInterval);

    this.onMessage(WS_EVENT.PLAYER_INPUT, (client, payload: InputPayload) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) throwError(WS_CODE.NOT_FOUND, ROOM_ERROR.CONNECTION_NOT_FOUND, client);

      player.lastActivityTime = Date.now();
      player.inputQueue.push(payload);
    });

    this.onMessage(WS_EVENT.REFRESH_TOKEN, (client, payload: AuthPayload) => {
      const authUser = validateJwt(payload.token);
      if (!authUser) throwError(WS_CODE.UNAUTHORIZED, ROOM_ERROR.INVALID_TOKEN, client);

      const player = this.state.players.get(client.sessionId);
      if (!player) throwError(WS_CODE.NOT_FOUND, ROOM_ERROR.CONNECTION_NOT_FOUND, client);

      const hasUserIdChanged = player.userId !== authUser.id;
      if (hasUserIdChanged) throwError(WS_CODE.FORBIDDEN, ROOM_ERROR.USER_ID_CHANGED, client);

      player.lastActivityTime = Date.now();
      player.tokenExpiresAt = authUser.expiresAt;

      logger.info({
        message: `Token refreshed`,
        data: { roomId: this.roomId, clientId: client.sessionId, userName: player.username },
      });
    });

    this.onMessage(WS_EVENT.LEAVE_ROOM, (client) => {
      client.leave(WS_CODE.SUCCESS);
    });

    this.setSimulationInterval((deltaTime) => {
      this.elapsedTime += deltaTime;

      while (this.elapsedTime >= FIXED_TIME_STEP) {
        this.elapsedTime -= FIXED_TIME_STEP;
        this.fixedTick();
      }
    });
  }

  fixedTick() {
    this.state.players.forEach((player, sessionId) => {
      try {
        let input: undefined | InputPayload;
        // dequeue player inputs
        while ((input = player.inputQueue.shift())) {
          if (input.left) player.isFacingRight = false;
          else if (input.right) player.isFacingRight = true;

          const { x: newX, y: newY } = calculateMovement({ ...player, ...PLAYER_SIZE, ...input });
          player.x = newX;
          player.y = newY;

          // Check if enough time has passed since last attack
          const currentTime = Date.now();
          const timeSinceLastAttack = currentTime - player.lastAttackTime;
          const canAttack = timeSinceLastAttack >= ATTACK_COOLDOWN;

          // find the damage frames in the attack animation
          if (
            timeSinceLastAttack >= ATTACK_DAMAGE__DELAY &&
            timeSinceLastAttack < ATTACK_DAMAGE__FRAME_TIME + ATTACK_DAMAGE__DELAY
          ) {
            // calculate the damage frame
            player.attackDamageFrameX = player.isFacingRight
              ? player.x + ATTACK_OFFSET_X
              : player.x - ATTACK_OFFSET_X;
            player.attackDamageFrameY = player.y - ATTACK_OFFSET_Y;

            // check if the attack hit an enemy
            for (const enemy of this.state.enemies) {
              if (
                enemy.x - ENEMY_SIZE.width / 2 < player.attackDamageFrameX + ATTACK_SIZE.width / 2 &&
                enemy.x + ENEMY_SIZE.width / 2 > player.attackDamageFrameX - ATTACK_SIZE.width / 2 &&
                enemy.y - ENEMY_SIZE.height / 2 < player.attackDamageFrameY + ATTACK_SIZE.height / 2 &&
                enemy.y + ENEMY_SIZE.height / 2 > player.attackDamageFrameY - ATTACK_SIZE.height / 2
              ) {
                this.state.enemies.splice(this.state.enemies.indexOf(enemy), 1);
                player.killCount++;
                RESULTS[this.roomId][player.userId].killCount++;
              }
            }
          } else {
            player.attackDamageFrameX = undefined;
            player.attackDamageFrameY = undefined;
          }

          // if the player is mid-attack, don't process any more inputs
          if (!canAttack) {
            return;
          } else if (input.attack) {
            player.isAttacking = true;
            player.attackCount++;
            player.lastAttackTime = currentTime;
            RESULTS[this.roomId][player.userId].attackCount++;
          } else {
            player.isAttacking = false;
          }
        }
      } catch (error) {
        const message = (error as Error)?.message || ROOM_ERROR.INTERNAL_SERVER_ERROR;
        const client = this.clients.find((c) => c.sessionId === sessionId);
        if (!client) {
          logger.info({
            message: `Client not found in fixedTick, skipping...`,
            data: { roomId: this.roomId, clientId: sessionId, error },
          });
          return;
        }

        throwError(WS_CODE.INTERNAL_SERVER_ERROR, message, client);
      }
    });

    const canSpawn = Date.now() >= this.lastEnemySpawnTime + ENEMY_SPAWN_RATE;

    if (this.state.enemies.length < MAX_ENEMIES && canSpawn) {
      this.lastEnemySpawnTime = Date.now();

      const enemy = new Enemy();
      enemy.id = nanoid();
      enemy.x = Math.random() * MAP_SIZE.width;
      enemy.y = Math.random() * MAP_SIZE.height;

      this.state.enemies.push(enemy);
    }

    // move the enemies randomly
    this.state.enemies.forEach((enemy) => {
      const moveLeft = Boolean(Math.round(Math.random()) * 1);
      const moveUp = Boolean(Math.round(Math.random()) * 1);
      const input = { left: moveLeft, right: !moveLeft, up: moveUp, down: !moveUp };

      const { x: newX, y: newY } = calculateMovement({ ...enemy, ...ENEMY_SIZE, ...input });
      enemy.x = newX;
      enemy.y = newY;
    });
  }

  checkPlayerConnection() {
    const clientsToRemove: Array<{ client: Client; reason: string }> = [];

    this.state.players.forEach((player, sessionId) => {
      const client = this.clients.find((c) => c.sessionId === sessionId);
      if (!client) {
        // Skip removal if we're still waiting for this client to reconnect
        if (this.expectingReconnections.has(sessionId)) return;

        this.cleanupPlayer(sessionId);
        return;
      }

      const tokenExpiresIn = player.tokenExpiresAt - Date.now();
      if (tokenExpiresIn <= 0) {
        clientsToRemove.push({ client, reason: ROOM_ERROR.TOKEN_EXPIRED });
        return;
      }

      const timeSinceLastActivity = Date.now() - player.lastActivityTime;
      if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        clientsToRemove.push({ client, reason: ROOM_ERROR.PLAYER_INACTIVITY });
        return;
      }
    });

    clientsToRemove.forEach(({ client, reason }) => {
      logger.info({
        message: `Removing client...`,
        data: { roomId: this.roomId, clientId: client.sessionId, reason },
      });

      try {
        client.leave(WS_CODE.TIMEOUT, reason);
      } catch (error) {
        logger.error({
          message: `Error removing client`,
          data: { roomId: this.roomId, clientId: client.sessionId, reason, error },
        });
        this.onLeave(client);
      }
    });
  }

  async onAuth(client: Client, __: unknown, context: AuthContext): Promise<AuthResult> {
    const authUser = validateJwt(context.token);
    if (!authUser) throwError(WS_CODE.UNAUTHORIZED, ROOM_ERROR.INVALID_TOKEN, client);

    const dbUser = await this.prisma.profile.findUnique({ where: { userId: authUser.id } });
    if (!dbUser) throwError(WS_CODE.NOT_FOUND, ROOM_ERROR.PROFILE_NOT_FOUND, client);

    return { user: dbUser, tokenExpiresAt: authUser.expiresAt };
  }

  onJoin(client: Client, _: unknown, { user, tokenExpiresAt }: AuthResult) {
    let existingSessionId: string | undefined;
    let existingPlayer: Player | undefined;

    this.state.players.forEach((player, sessionId) => {
      if (player.userId === user.userId) {
        existingSessionId = sessionId;
        existingPlayer = player;
      }
    });

    if (existingSessionId) {
      logger.info({
        message: `Replacing existing connection`,
        data: {
          roomId: this.roomId,
          existingClientId: existingSessionId,
          newClientId: client.sessionId,
          userName: user.userName,
        },
      });

      const existingClient = this.clients.find((c) => c.sessionId === existingSessionId);
      if (existingClient) {
        existingClient.leave(WS_CODE.FORBIDDEN, ROOM_ERROR.NEW_CONNECTION_FOUND);
      } else {
        this.cleanupPlayer(existingSessionId);
      }
    }

    logger.info({
      message: `New player joined!`,
      data: { roomId: this.roomId, clientId: client.sessionId, userName: user.userName },
    });

    let player: Player;
    if (existingPlayer) {
      player = existingPlayer;
      player.tokenExpiresAt = tokenExpiresAt;
      player.lastActivityTime = Date.now();
    } else {
      player = new Player();
      player.tokenExpiresAt = tokenExpiresAt;
      player.lastActivityTime = Date.now();
      player.userId = user.userId;
      player.username = user.userName;
      player.x = Math.random() * MAP_SIZE.width;
      player.y = Math.random() * MAP_SIZE.height;
    }

    this.state.players.set(client.sessionId, player);

    if (!RESULTS[this.roomId]) RESULTS[this.roomId] = {};
    RESULTS[this.roomId][player.userId] = {
      username: user.userName,
      attackCount: player.attackCount,
      killCount: player.killCount,
    };
  }

  async onLeave(client: Client, consented?: boolean) {
    const { sessionId } = client;

    logger.info({
      message: `Client left...`,
      data: { roomId: this.roomId, clientId: sessionId, consented },
    });

    if (consented) {
      this.cleanupPlayer(sessionId);
      return;
    }

    try {
      logger.info({
        message: `Attempting to reconnect client`,
        data: { roomId: this.roomId, clientId: sessionId },
      });

      this.expectingReconnections.add(sessionId);

      await this.allowReconnection(client, this.reconnectionTimeout);

      this.expectingReconnections.delete(sessionId);

      logger.info({
        message: `Client reconnected`,
        data: { roomId: this.roomId, clientId: sessionId },
      });
    } catch {
      logger.info({
        message: `Client failed to reconnect in time`,
        data: { roomId: this.roomId, clientId: sessionId },
      });

      this.cleanupPlayer(sessionId);
    }
  }

  cleanupPlayer(sessionId: string) {
    this.expectingReconnections.delete(sessionId);

    const player = this.state.players.get(sessionId);
    if (player) {
      logger.info({
        message: `Cleaning up player...`,
        data: { roomId: this.roomId, clientId: sessionId, userName: player.username },
      });

      this.state.players.delete(sessionId);
    }
  }

  onDispose() {
    logger.info({
      message: `Room disposing...`,
      data: { roomId: this.roomId },
    });

    if (this.connectionCheckTimeout) clearInterval(this.connectionCheckTimeout);

    // delete results after 10 seconds -- stop gap for in-memory management
    setTimeout(() => delete RESULTS[this.roomId], 10 * 1000);
  }

  onUncaughtException(error: Error, methodName: string) {
    // simply log the error message for "expected" errors
    if (Object.values(ROOM_ERROR as Record<string, string>).includes(error.message)) {
      logger.info({
        message: error.message,
        data: { roomId: this.roomId, methodName },
      });
      return;
    }
    // log any uncaught errors for debugging purposes
    logger.error({
      message: `Uncaught exception`,
      data: { roomId: this.roomId, methodName, error },
    });

    // possibly handle saving game state
    // possibly handle disconnecting all clients if needed
  }
}

const throwError = (code: number, message: string, client: Client) => {
  client.leave(code, message);
  throw new ServerError(code, message);
};
