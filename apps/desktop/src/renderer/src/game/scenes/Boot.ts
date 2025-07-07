import { Scene } from 'phaser';
import background from '../../assets/bg.png';
import { ASSET, SCENE } from './constants';

export class Boot extends Scene {
  constructor() {
    super(SCENE.BOOT);
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image(ASSET.BACKGROUND, background);
  }

  create() {
    this.scene.start(SCENE.PRELOADER);
  }
}
