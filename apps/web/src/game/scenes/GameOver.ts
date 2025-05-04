import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene {
  camera?: Phaser.Cameras.Scene2D.Camera;
  background?: Phaser.GameObjects.Image;
  gameOverText?: Phaser.GameObjects.Text;
  cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('GameOver');
  }

  preload() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();
  }

  create({
    gameResults,
  }: {
    gameResults: Array<{ username: string; attackCount: number; killCount: number }>;
  }) {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0xff0000);

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.5);

    this.gameOverText = this.add
      .text(512, 184, 'Game Over', {
        fontFamily: 'Arial Black',
        fontSize: 64,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.add
      .text(375, 10, 'Press Shift to continue')
      .setStyle({
        fontSize: 20,
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setDepth(100);

    gameResults.forEach((result, index) => {
      const accuracy = (result.killCount / result.attackCount) * 100;

      this.add
        .text(
          512,
          384 + index * 30,
          `${result.username} - ${result.killCount} kill${result.killCount === 1 ? '' : 's'} (${accuracy.toFixed(2)}% accuracy)`,
          {
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
          }
        )
        .setOrigin(0.5)
        .setDepth(100);
    });

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    if (this.cursorKeys?.shift.isDown) {
      this.changeScene();
    }
  }

  changeScene() {
    this.scene.start('MainMenu');
  }
}
