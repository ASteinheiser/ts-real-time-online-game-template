import { Room, Client } from '@colyseus/core';
import { nanoid } from 'nanoid';
import { MyRoomState, Player, InputPayload, Enemy } from './schema/MyRoomState';
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
} from '@repo/core-game';
import { PrismaClient } from '../prisma-client';

// Basic storage of results for all players in the room
// Expires when the room is disposed
interface Result {
  username: string;
  attackCount: number;
  killCount: number;
}
export const RESULTS: Record<string, Result> = {};

interface MyRoomArgs {
  prisma: PrismaClient;
}

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;
  state = new MyRoomState();
  elapsedTime = 0;
  lastEnemySpawnTime = 0;
  prisma: PrismaClient;

  onCreate({ prisma }: MyRoomArgs) {
    this.prisma = prisma;

    this.onMessage('playerInput', (client, payload: InputPayload) => {
      const player = this.state.players.get(client.sessionId);

      player?.inputQueue.push(payload);
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
              RESULTS[sessionId].killCount++;
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
          RESULTS[sessionId].attackCount++;
        } else {
          player.isAttacking = false;
        }
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

  onJoin(client: Client, options: { username: string }) {
    const username = options.username ?? `random-user-${Math.floor(Math.random() * 10000)}`;

    console.log(`${username} (${client.sessionId}) joined!`);

    const player = new Player();

    player.username = username;
    player.x = Math.random() * MAP_SIZE.width;
    player.y = Math.random() * MAP_SIZE.height;

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);

    RESULTS[client.sessionId] = { username, attackCount: 0, killCount: 0 };
  }

  onLeave(client: Client) {
    const player = this.state.players.get(client.sessionId);

    console.log(`${player?.username} (${client.sessionId}) left!`);

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');

    Object.keys(RESULTS).forEach((sessionId) => {
      delete RESULTS[sessionId];
    });
  }
}
