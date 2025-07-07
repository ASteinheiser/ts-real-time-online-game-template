import { Scene } from 'phaser';
import { EventBus, EVENT_BUS } from '../EventBus';
import { CustomText } from '../objects/CustomText';
import { ASSET, SCENE } from '../constants';

export class GameOver extends Scene {
  cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super(SCENE.GAME_OVER);
  }

  preload() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();
  }

  create({
    gameResults,
  }: {
    gameResults: Array<{ username: string; attackCount: number; killCount: number }>;
  }) {
    this.cameras.main.setBackgroundColor(0xff0000);
    this.add.image(512, 384, ASSET.BACKGROUND).setAlpha(0.5);

    new CustomText(this, 512, 184, 'Game Over', {
      fontFamily: 'Arial Black',
      fontSize: '64px',
      strokeThickness: 8,
    })
      .setOrigin(0.5)
      .typeWriter(150);

    new CustomText(this, 375, 10, 'Press Shift to continue', { fontSize: 20 }).fadeIn(1500);

    gameResults.forEach((result, index) => {
      const accuracy = ((result.killCount / result.attackCount || 0) * 100).toFixed(2);

      const killCountText = `${result.killCount} kill${result.killCount === 1 ? '' : 's'}`;

      const resultText = `${result.username} - ${killCountText} (${accuracy}% accuracy)`;

      new CustomText(this, 512, 384 + index * 30, resultText, { fontFamily: 'Arial' })
        .setOrigin(0.5)
        .fadeIn(500, 300 * (index + 1));
    });

    EventBus.emit(EVENT_BUS.CURRENT_SCENE_READY, this);
  }

  update() {
    if (this.cursorKeys?.shift.isDown) {
      this.changeScene();
    }
  }

  changeScene() {
    this.scene.start(SCENE.MAIN_MENU);
  }
}
