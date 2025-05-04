import { Scene } from 'phaser';
import { Client, Room, getStateCallbacks } from 'colyseus.js';
import { EventBus } from '../EventBus';
import { Player } from '../objects/Player';
import { Hitbox } from '../objects/Hitbox';
import { Enemy } from '../objects/Enemy';

const GAME_SERVER_URL = 'ws://localhost:4204';
const GAME_API_URL = 'http://localhost:4204';

// how fast the player moves
const VELOCITY = 2;

export class Game extends Scene {
  camera?: Phaser.Cameras.Scene2D.Camera;
  background?: Phaser.GameObjects.Image;
  gameText?: Phaser.GameObjects.Text;
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
  fixedTimeStep = 1000 / 128;

  constructor() {
    super('Game');

    this.client = new Client(GAME_SERVER_URL);
  }

  preload() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();
  }

  async create({ username }: { username: string }) {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.5);

    this.add
      .text(340, 10, 'Press Shift to leave the game')
      .setStyle({
        fontSize: 20,
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setDepth(100);

    try {
      this.room = await this.client.joinOrCreate('my_room', { username });
    } catch (e) {
      console.error('join error', e);
    }
    if (!this.room) return;

    const $ = getStateCallbacks(this.room);

    $(this.room.state).players.onAdd((player, sessionId) => {
      const entity = this.physics.add.sprite(player.x, player.y, 'player').setDepth(100);

      const nameText = this.add
        .text(player.x, player.y, player.username, {
          fontSize: 12,
          stroke: '#000000',
          strokeThickness: 4,
        })
        .setOrigin(0.5, 2.5)
        .setDepth(100);

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

            if (
              player.attackDamageFrameX !== undefined &&
              player.attackDamageFrameY !== undefined
            ) {
              new Hitbox(this, player.attackDamageFrameX, player.attackDamageFrameY, 0x0000ff);
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

          if (player.attackDamageFrameX !== undefined && player.attackDamageFrameY !== undefined) {
            new Hitbox(this, player.attackDamageFrameX, player.attackDamageFrameY, 0xff0000);
          }
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
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(this.fixedTimeStep);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fixedTick(_: number) {
    if (!this.room || !this.currentPlayer || !this.cursorKeys) return;

    // press shift to leave the game
    if (this.cursorKeys.shift.isDown) {
      this.changeScene();
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

    this.currentPlayer.move({
      x: left ? x - VELOCITY : right ? x + VELOCITY : x,
      y: up ? y - VELOCITY : down ? y + VELOCITY : y,
    });

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

  async changeScene() {
    const response = await fetch(`${GAME_API_URL}/game-results`);
    const data: Record<string, { username: string; attackCount: number; killCount: number }> =
      await response.json();
    const gameResults = Object.keys(data).map((sessionId) => ({
      username: data[sessionId].username,
      attackCount: data[sessionId].attackCount,
      killCount: data[sessionId].killCount,
    }));

    this.currentPlayer?.destroy();
    delete this.currentPlayer;
    this.remoteRef?.destroy();
    delete this.remoteRef;
    Object.values(this.playerEntities).forEach((player) => player.destroy());
    this.playerEntities = {};
    Object.values(this.enemyEntities).forEach((enemy) => enemy.destroy());
    this.enemyEntities = {};

    await this.room?.leave();

    this.scene.start('GameOver', { gameResults });
  }
}
