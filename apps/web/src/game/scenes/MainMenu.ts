import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
  background?: GameObjects.Image;
  title?: GameObjects.Text;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.background = this.add.image(512, 384, 'background');

    this.title = this.add
      .text(512, 300, 'Duck, Duck, Punch', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.add
      .text(512, 460, 'Click to start', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setInteractive()
      .on('pointerdown', () => {
        EventBus.emit('menu-open__game-start');
      });

    EventBus.emit('current-scene-ready', this);
  }

  changeScene(username?: string) {
    console.log('changeScene', { username });
    // this.scene.start('Game', { username });
  }
}
