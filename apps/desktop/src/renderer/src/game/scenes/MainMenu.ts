import { Scene } from 'phaser';
import type { AuthPayload } from '@repo/core-game';
import { EventBus, EVENT_BUS } from '../EventBus';
import { CustomText } from '../objects/CustomText';
import { ASSET, SCENE } from '../constants';

export class MainMenu extends Scene {
  constructor() {
    super(SCENE.MAIN_MENU);
  }

  create() {
    this.add.image(512, 384, ASSET.BACKGROUND);

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
        EventBus.emit(EVENT_BUS.GAME_START);
      })
      .fadeIn(1000);

    new CustomText(this, 512, 560, 'Profile', {
      fontFamily: 'Arial Black',
      fontSize: '38px',
      strokeThickness: 8,
    })
      .setOrigin(0.5)
      .makeButton('#ff00ff', () => {
        EventBus.emit(EVENT_BUS.PROFILE_OPEN);
      })
      .fadeIn(1000);

    new CustomText(this, 512, 660, 'Options', {
      fontFamily: 'Arial Black',
      fontSize: '38px',
      strokeThickness: 8,
    })
      .setOrigin(0.5)
      .makeButton('#ff00ff', () => {
        EventBus.emit(EVENT_BUS.OPTIONS_OPEN);
      })
      .fadeIn(1000);

    EventBus.emit(EVENT_BUS.CURRENT_SCENE_READY, this);
  }

  startGame({ token }: AuthPayload) {
    this.scene.start(SCENE.GAME, { token });
  }
}
