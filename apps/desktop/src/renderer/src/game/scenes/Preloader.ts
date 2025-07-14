import { Scene } from 'phaser';
import { PLAYER_FRAME_RATE, PLAYER_SIZE, ENEMY_SIZE } from '@repo/core-game';
import enemy from '../../assets/evil-dude.png';
import player from '../../assets/muscle-duck-sprite.png';
import { PLAYER_ANIM } from '../objects/Player';
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

    this.anims.create({
      key: PLAYER_ANIM.IDLE,
      frames: this.anims.generateFrameNumbers(ASSET.PLAYER, { frames: [0] }),
      frameRate: PLAYER_FRAME_RATE,
      repeat: 0,
    });
    this.anims.create({
      key: PLAYER_ANIM.WALK,
      frames: this.anims.generateFrameNumbers(ASSET.PLAYER, { frames: [2, 3, 4, 1] }),
      frameRate: PLAYER_FRAME_RATE,
      repeat: -1,
    });
    // total animation length is 0.625s (5 frames at 8fps)
    // actual punch frame is 0.375s after start of animation (frame 3 / 5)
    this.anims.create({
      key: PLAYER_ANIM.PUNCH,
      frames: this.anims.generateFrameNumbers(ASSET.PLAYER, { frames: [5, 6, 7, 8, 5] }),
      frameRate: PLAYER_FRAME_RATE,
      repeat: 0,
    });

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start(SCENE.MAIN_MENU);
  }
}
