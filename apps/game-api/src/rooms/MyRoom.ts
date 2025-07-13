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
  type AuthPayload,
  type InputPayload,
} from '@repo/core-game';
import { MyRoomState, Player, Enemy } from './schema/MyRoomState';
import type { PrismaClient, Profile } from '../prisma-client';
import { validateJwt } from '../auth/jwt';
import { ROOM_ERROR } from './error';
import { logger } from '../logger';

const MAX_PLAYERS_PER_ROOM = 4;

// basic in-memory storage of results for all players in a room
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

interface MyRoomArgs {
  prisma: PrismaClient;
}

export class MyRoom extends Room<MyRoomState> {
  maxClients = MAX_PLAYERS_PER_ROOM;
  state = new MyRoomState();
  elapsedTime = 0;
  lastEnemySpawnTime = 0;
  prisma: PrismaClient;

  onCreate({ prisma }: MyRoomArgs) {
    logger.info({ message: `room ${this.roomId} created!` });

    this.prisma = prisma;

    this.onMessage(WS_EVENT.PLAYER_INPUT, (client, payload: InputPayload) => {
      const player = this.state.players.get(client.sessionId);

      player?.inputQueue?.push(payload);
    });

    this.onMessage(WS_EVENT.REFRESH_TOKEN, (client, payload: AuthPayload) => {
      const authUser = validateJwt(payload.token);
      if (!authUser) throwError(WS_CODE.UNAUTHORIZED, ROOM_ERROR.INVALID_TOKEN, client);

      const player = this.state.players.get(client.sessionId);
      if (!player) throwError(WS_CODE.NOT_FOUND, ROOM_ERROR.CONNECTION_NOT_FOUND, client);

      if (player.userId !== authUser.id) {
        throwError(WS_CODE.FORBIDDEN, ROOM_ERROR.USER_ID_CHANGED, client);
      }

      player.tokenExpiresAt = authUser.expiresAt;
      logger.info({ message: `Token refreshed for ${player.username}` });
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
      const tokenExpiresIn = player.tokenExpiresAt - Date.now();
      if (tokenExpiresIn <= 0) {
        const client = this.clients.find((client) => client.sessionId === sessionId);
        throwError(WS_CODE.TIMEOUT, ROOM_ERROR.TOKEN_EXPIRED, client);
      }
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
        throwError(
          WS_CODE.INTERNAL_SERVER_ERROR,
          (error as Error)?.message || ROOM_ERROR.INTERNAL_SERVER_ERROR,
          this.clients.find((client) => client.sessionId === sessionId)
        );
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

  async onAuth(client: Client, __: unknown, context: AuthContext): Promise<AuthResult> {
    const authUser = validateJwt(context.token);
    if (!authUser) throwError(WS_CODE.UNAUTHORIZED, ROOM_ERROR.INVALID_TOKEN, client);

    const dbUser = await this.prisma.profile.findUnique({ where: { userId: authUser.id } });
    if (!dbUser) throwError(WS_CODE.NOT_FOUND, ROOM_ERROR.PROFILE_NOT_FOUND, client);

    return { user: dbUser, tokenExpiresAt: authUser.expiresAt };
  }

  onJoin(client: Client, _: unknown, { user, tokenExpiresAt }: AuthResult) {
    this.state.players.forEach((player) => {
      if (player.userId === user.userId) {
        throwError(WS_CODE.FORBIDDEN, ROOM_ERROR.PLAYER_ALREADY_JOINED, client);
      }
    });

    logger.info({ message: `${user.userName} (${client.sessionId}) joined!` });

    const player = new Player();

    player.userId = user.userId;
    player.tokenExpiresAt = tokenExpiresAt;
    player.username = user.userName;
    player.x = Math.random() * MAP_SIZE.width;
    player.y = Math.random() * MAP_SIZE.height;

    this.state.players.set(client.sessionId, player);

    if (!RESULTS[this.roomId]) RESULTS[this.roomId] = {};
    RESULTS[this.roomId][player.userId] = {
      username: user.userName,
      attackCount: 0,
      killCount: 0,
    };
  }

  onLeave(client: Client) {
    const player = this.state.players.get(client.sessionId);

    if (player) {
      logger.info({ message: `${player.username} (${client.sessionId}) left...` });

      this.state.players.delete(client.sessionId);
    }
  }

  onDispose() {
    logger.info({ message: `room ${this.roomId} disposing...` });

    // delete results after 10 seconds -- stop gap for in-memory management
    setTimeout(() => {
      Object.keys(RESULTS).forEach((roomId) => delete RESULTS[roomId]);
    }, 10000);
  }

  onUncaughtException(error: Error, methodName: string) {
    // simply log the error message for "expected" errors
    if (Object.values(ROOM_ERROR as Record<string, string>).includes(error.message)) {
      logger.info({ message: error.message });
      return;
    }
    // log any uncaught errors for debugging purposes
    logger.error({ message: `uncaught exception in ${methodName}`, data: { error } });

    // possibly handle saving game state
    // possibly handle disconnecting all clients if needed
  }
}

const throwError = (code: number, message: string, client: Client) => {
  client.leave(code, message);
  throw new ServerError(code, message);
};
