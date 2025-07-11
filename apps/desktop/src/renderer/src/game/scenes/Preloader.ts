import { Scene } from 'phaser';
import { PLAYER_SIZE, ENEMY_SIZE } from '@repo/core-game';
import enemy from '../../assets/evil-dude.png';
import player from '../../assets/muscle-duck-sprite.png';
import { ASSET, SCENE } from '../constants';

export class Preloader extends Scene {
  constructor() {
    super(SCENE.PRELOADER);
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, ASSET.BACKGROUND);

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.spritesheet(ASSET.ENEMY, enemy, {
      frameWidth: ENEMY_SIZE.width,
      frameHeight: ENEMY_SIZE.height,
    });
    this.load.spritesheet(ASSET.PLAYER, player, {
      frameWidth: PLAYER_SIZE.width,
      frameHeight: PLAYER_SIZE.height,
    });
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start(SCENE.MAIN_MENU);
  }
}
