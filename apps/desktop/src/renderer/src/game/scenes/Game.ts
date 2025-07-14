import { Scene } from 'phaser';
import { Client, Room, getStateCallbacks } from 'colyseus.js';
import {
  calculateMovement,
  FIXED_TIME_STEP,
  PLAYER_SIZE,
  WS_ROOM,
  WS_EVENT,
  WS_CODE,
  type AuthPayload,
  type InputPayload,
} from '@repo/core-game';
import { gql } from '@apollo/client';
import { client } from '../../graphql/client';
import { Desktop_GetGameResultsQuery, Desktop_GetGameResultsQueryVariables } from '../../graphql';
import { EventBus, EVENT_BUS } from '../EventBus';
import { Player } from '../objects/Player';
import { PunchBox } from '../objects/PunchBox';
import { Enemy } from '../objects/Enemy';
import { CustomText } from '../objects/CustomText';
import { ASSET, SCENE } from '../constants';

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
if (!WEBSOCKET_URL) throw new Error('VITE_WEBSOCKET_URL is not set');

export class Game extends Scene {
  client: Client;
  room?: Room;
  playerEntities: Record<string, Player> = {};
  currentPlayer?: Player;
  /** This is used to track the player according to the server */
  remoteRef?: Phaser.GameObjects.Rectangle;
  enemyEntities: Record<string, Enemy> = {};

  cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  inputPayload: InputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
    attack: false,
  };
  elapsedTime = 0;

  constructor() {
    super(SCENE.GAME);

    this.client = new Client(WEBSOCKET_URL);
  }

  preload() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();
  }

  async refreshToken({ token }: AuthPayload) {
    if (token === this.client?.auth?.token) return;

    try {
      this.client.auth.token = token;
      this.room?.send(WS_EVENT.REFRESH_TOKEN, { token });
    } catch (error) {
      console.error('Failed to refresh token: ', error);
    }
  }

  async create({ token }: AuthPayload) {
    this.cameras.main.setBackgroundColor(0x00ff00);
    this.add.image(512, 384, ASSET.BACKGROUND).setAlpha(0.5);

    new CustomText(this, 340, 10, 'Press Shift to leave the game', { fontSize: 20 });

    try {
      this.client.auth.token = token;
      this.room = await this.client.joinOrCreate(WS_ROOM.GAME_ROOM);
    } catch (error) {
      await this.sendToMainMenu(error);
      return;
    }
    if (!this.room) {
      await this.sendToMainMenu(new Error('Failed to join'));
      return;
    }

    this.room.onError((code, message) => {
      const errorMessage = `Room error: ${code} - ${message}`;
      console.error(errorMessage);

      this.sendToMainMenu(new Error(errorMessage));
    });

    this.room.onLeave((code) => {
      switch (code) {
        case WS_CODE.SUCCESS:
          this.sendToGameOver();
          break;
        case WS_CODE.NOT_FOUND:
        case WS_CODE.INTERNAL_SERVER_ERROR:
          this.sendToMainMenu(new Error('Oops, something went wrong'));
          break;
        case WS_CODE.UNAUTHORIZED:
          this.sendToMainMenu(new Error('You are not authorized'));
          break;
        case WS_CODE.FORBIDDEN:
          this.sendToMainMenu(new Error('You are not allowed'));
          break;
        case WS_CODE.TIMEOUT:
          this.sendToMainMenu(new Error('You were removed from the game'));
          break;
        default:
          this.sendToMainMenu(new Error(`Disconnected with code: ${code}`));
      }
    });

    const $ = getStateCallbacks(this.room);

    $(this.room.state).players.onAdd((player, sessionId) => {
      const entity = this.physics.add.sprite(player.x, player.y, ASSET.PLAYER).setDepth(100);

      const nameText = new CustomText(this, player.x, player.y, player.username, {
        fontSize: 12,
      }).setOrigin(0.5, 2.5);

      const newPlayer = new Player(entity, nameText);

      this.playerEntities[sessionId] = newPlayer;

      // keep track of the current player
      if (sessionId === this.room?.sessionId) {
        this.currentPlayer = newPlayer;

        // #region FOR DEBUGGING PURPOSES
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
        // #endregion FOR DEBUGGING PURPOSES
      } else {
        // update the other players positions from the server
        $(player).onChange(() => {
          entity.setData('serverUsername', player.username);
          entity.setData('serverX', player.x);
          entity.setData('serverY', player.y);
          entity.setData('serverAttack', player.isAttacking);

          // #region FOR DEBUGGING PURPOSES
          if (player.attackDamageFrameX !== undefined && player.attackDamageFrameY !== undefined) {
            new PunchBox(this, player.attackDamageFrameX, player.attackDamageFrameY, 0xff0000);
          }
          // #endregion FOR DEBUGGING PURPOSES
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

    EventBus.emit(EVENT_BUS.CURRENT_SCENE_READY, this);
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
      this.room.send(WS_EVENT.LEAVE_ROOM);
      return;
    }

    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.inputPayload.attack = this.cursorKeys.space.isDown;

    this.room.send(WS_EVENT.PLAYER_INPUT, this.inputPayload);

    if (this.inputPayload.attack) this.currentPlayer.punch();

    const { x, y } = this.currentPlayer.entity;
    const { left, right, up, down } = this.inputPayload;

    const newPosition = calculateMovement({ x, y, ...PLAYER_SIZE, left, right, up, down });
    this.currentPlayer.move(newPosition);

    for (const sessionId in this.playerEntities) {
      // skip the current player since we are handling on the client
      if (sessionId === this.room.sessionId) continue;
      // interpolate all other player entities from the server
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
  }

  async sendToMainMenu(error: unknown) {
    console.error(error);
    EventBus.emit(EVENT_BUS.JOIN_ERROR, error);

    await this.cleanup();
    this.scene.start(SCENE.MAIN_MENU);
  }

  async sendToGameOver() {
    const roomId = this.room?.roomId;
    if (!roomId) return;

    const gameResults = await getGameResults(roomId);

    await this.cleanup();
    this.scene.start(SCENE.GAME_OVER, { gameResults });
  }
}

const getGameResults = async (roomId: string) => {
  const { data } = await client.query<Desktop_GetGameResultsQuery, Desktop_GetGameResultsQueryVariables>({
    variables: { roomId },
    fetchPolicy: 'network-only',
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
