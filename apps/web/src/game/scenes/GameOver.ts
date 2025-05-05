import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { CustomText } from '../objects/CustomText';

export class GameOver extends Scene {
  camera?: Phaser.Cameras.Scene2D.Camera;
  background?: Phaser.GameObjects.Image;
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

    new CustomText(this, 512, 184, 'Game Over', {
      fontFamily: 'Arial Black',
      fontSize: '64px',
      strokeThickness: 8,
    })
      .setOrigin(0.5)
      .setDepth(100)
      .typeWriter(150);

    new CustomText(this, 375, 10, 'Press Shift to continue', {
      fontSize: '20px',
    })
      .setDepth(100)
      .fadeIn(1500);

    gameResults.forEach((result, index) => {
      const accuracy = ((result.killCount / result.attackCount) * 100).toFixed(2);

      const killCountText = `${result.killCount} kill${result.killCount === 1 ? '' : 's'}`;

      const resultText = `${result.username} - ${killCountText} (${accuracy}% accuracy)`;

      new CustomText(this, 512, 384 + index * 30, resultText)
        .setOrigin(0.5)
        .setDepth(100)
        .fadeIn(500, 300 * (index + 1));
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
