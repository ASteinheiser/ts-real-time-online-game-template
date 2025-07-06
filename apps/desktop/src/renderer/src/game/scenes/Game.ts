import { Scene } from 'phaser';
import { Client, Room, getStateCallbacks } from 'colyseus.js';
import { calculateMovement, FIXED_TIME_STEP, PLAYER_SIZE } from '@repo/core-game';
import { gql } from '@apollo/client';
import { client } from '../../graphql/client';
import { Desktop_GetGameResultsQuery, Desktop_GetGameResultsQueryVariables } from '../../graphql';
import { EventBus } from '../EventBus';
import { Player } from '../objects/Player';
import { PunchBox } from '../objects/PunchBox';
import { Enemy } from '../objects/Enemy';
import { CustomText } from '../objects/CustomText';

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
if (!WEBSOCKET_URL) throw new Error('VITE_WEBSOCKET_URL is not set');

export class Game extends Scene {
  client: Client;
  room?: Room;
  playerEntities: Record<string, Player> = {};
  currentPlayer?: Player;
  remoteRef?: Phaser.GameObjects.Rectangle;
  enemyEntities: Record<string, Enemy> = {};

  cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  inputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
    attack: false,
  };
  elapsedTime = 0;

  constructor() {
    super('Game');

    this.client = new Client(WEBSOCKET_URL);
  }

  preload() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();
  }

  async create({ token }: { token: string }) {
    this.cameras.main.setBackgroundColor(0x00ff00);
    this.add.image(512, 384, 'background').setAlpha(0.5);

    new CustomText(this, 340, 10, 'Press Shift to leave the game', { fontSize: 20 });

    try {
      this.room = await this.client.joinOrCreate('my_room', { token });
    } catch (error) {
      console.error(error);
      EventBus.emit('join-error', error);
      await this.sendToMainMenu();
    }
    if (!this.room) return;

    const $ = getStateCallbacks(this.room);

    $(this.room.state).players.onAdd((player, sessionId) => {
      const entity = this.physics.add.sprite(player.x, player.y, 'player').setDepth(100);

      const nameText = new CustomText(this, player.x, player.y, player.username, {
        fontSize: 12,
      }).setOrigin(0.5, 2.5);

      const newPlayer = new Player(entity, nameText);

      this.playerEntities[sessionId] = newPlayer;

      // keep track of the current player
      if (sessionId === this.room?.sessionId) {
        this.currentPlayer = newPlayer;

        // #START FOR DEBUGGING PURPOSES
        // tracks the player according to the server
        this.remoteRef = this.add.rectangle(0, 0, entity.width, entity.height).setDepth(100);
        this.remoteRef.setStrokeStyle(1, 0xff0000);

        $(player).onChange(() => {
          if (this.remoteRef) {
            this.remoteRef.x = player.x;
            this.remoteRef.y = player.y;

            if (player.attackDamageFrameX !== undefined && player.attackDamageFrameY !== undefined) {
              new PunchBox(this, player.attackDamageFrameX, player.attackDamageFrameY, 0x0000ff);
            }
          }
        });
        // #END FOR DEBUGGING PURPOSES
      } else {
        // update the other players positions from the server
        $(player).onChange(() => {
          entity.setData('serverUsername', player.username);
          entity.setData('serverX', player.x);
          entity.setData('serverY', player.y);
          entity.setData('serverAttack', player.isAttacking);

          // #START FOR DEBUGGING PURPOSES
          if (player.attackDamageFrameX !== undefined && player.attackDamageFrameY !== undefined) {
            new PunchBox(this, player.attackDamageFrameX, player.attackDamageFrameY, 0xff0000);
          }
          // #END FOR DEBUGGING PURPOSES
        });
      }
    });

    $(this.room.state).players.onRemove((_, sessionId) => {
      const foundPlayer = this.playerEntities[sessionId];
      if (foundPlayer) {
        foundPlayer.destroy();
        delete this.playerEntities[sessionId];
      }
    });

    $(this.room.state).enemies.onAdd((enemy) => {
      const entity = new Enemy(this, enemy.x, enemy.y);
      this.enemyEntities[enemy.id] = entity;

      $(enemy).onChange(() => {
        entity.move(
          Phaser.Math.Linear(entity.entity.x, enemy.x, 0.2),
          Phaser.Math.Linear(entity.entity.y, enemy.y, 0.2)
        );
      });
    });

    $(this.room.state).enemies.onRemove((enemy) => {
      const foundEnemy = this.enemyEntities[enemy.id];
      if (foundEnemy) {
        foundEnemy.destroy();
        delete this.enemyEntities[enemy.id];
      }
    });

    EventBus.emit('current-scene-ready', this);
  }

  update(_: number, delta: number): void {
    // skip if not yet connected
    if (!this.currentPlayer) return;

    this.elapsedTime += delta;
    while (this.elapsedTime >= FIXED_TIME_STEP) {
      this.elapsedTime -= FIXED_TIME_STEP;
      this.fixedTick();
    }
  }

  fixedTick() {
    if (!this.room || !this.currentPlayer || !this.cursorKeys) return;

    // press shift to leave the game
    if (this.cursorKeys.shift.isDown) {
      this.sendToGameOver();
      return;
    }

    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.inputPayload.attack = this.cursorKeys.space.isDown;
    this.room.send('playerInput', this.inputPayload);

    if (this.inputPayload.attack) {
      this.currentPlayer.punch();
    }

    const { x, y } = this.currentPlayer.entity;
    const { left, right, up, down } = this.inputPayload;

    const newPosition = calculateMovement({ x, y, ...PLAYER_SIZE, left, right, up, down });
    this.currentPlayer.move(newPosition);

    for (const sessionId in this.playerEntities) {
      // skip the current player
      if (sessionId === this.room.sessionId) continue;
      // interpolate all other player entities
      const serverPlayer = this.playerEntities[sessionId];
      const { serverX, serverY, serverAttack } = serverPlayer.entity.data.values;

      if (serverAttack) {
        serverPlayer.punch();
      } else {
        serverPlayer.stopPunch();
      }
      serverPlayer.move({
        x: Phaser.Math.Linear(serverPlayer.entity.x, serverX, 0.2),
        y: Phaser.Math.Linear(serverPlayer.entity.y, serverY, 0.2),
      });
    }
  }

  async cleanup() {
    this.currentPlayer?.destroy();
    delete this.currentPlayer;
    this.remoteRef?.destroy();
    delete this.remoteRef;
    Object.values(this.playerEntities).forEach((player) => player.destroy());
    this.playerEntities = {};
    Object.values(this.enemyEntities).forEach((enemy) => enemy.destroy());
    this.enemyEntities = {};

    await this.room?.leave();
  }

  async sendToMainMenu() {
    await this.cleanup();
    this.scene.start('MainMenu');
  }

  async sendToGameOver() {
    const roomId = this.room?.roomId;
    if (!roomId) return;

    const gameResults = await getGameResults(roomId);

    await this.cleanup();
    this.scene.start('GameOver', { gameResults });
  }
}

const getGameResults = async (roomId: string) => {
  const { data } = await client.query<Desktop_GetGameResultsQuery, Desktop_GetGameResultsQueryVariables>({
    variables: {
      roomId,
    },
    query: gql`
      query Desktop_GetGameResults($roomId: String!) {
        gameResults(roomId: $roomId) {
          username
          attackCount
          killCount
        }
      }
    `,
  });

  return data?.gameResults ?? [];
};
