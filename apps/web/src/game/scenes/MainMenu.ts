import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { CustomText } from '../objects/CustomText';

export class MainMenu extends Scene {
  background?: GameObjects.Image;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.background = this.add.image(512, 384, 'background');

    new CustomText(this, 512, 300, 'Duck, Duck, Punch', {
      fontFamily: 'Arial Black',
      fontSize: '38px',
      strokeThickness: 8,
    })
      .setOrigin(0.5)
      .bounce(5, 2000);

    new CustomText(this, 512, 460, 'Click here to start', {
      fontFamily: 'Arial Black',
      fontSize: '38px',
      strokeThickness: 8,
    })
      .setOrigin(0.5)
      .makeButton('#ff00ff', () => {
        EventBus.emit('menu-open__game-start');
      })
      .fadeIn(1000);

    EventBus.emit('current-scene-ready', this);
  }

  changeScene(username?: string) {
    this.scene.start('Game', { username });
  }
}
