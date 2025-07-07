import { ASSET } from '../constants';

// used to handle slight differences in player position due to interpolation of server values
const MOVEMENT_THRESHOLD = 0.1;

const FRAME_RATE = 8;
const PLAYER_ANIM = {
  IDLE: 'playerIdle',
  WALK: 'playerWalk',
  PUNCH: 'playerPunch',
};

export class Player {
  entity: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  nameText: Phaser.GameObjects.Text;

  constructor(entity: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, nameText: Phaser.GameObjects.Text) {
    this.entity = entity;
    this.nameText = nameText;

    this.entity.anims.create({
      key: PLAYER_ANIM.IDLE,
      frames: this.entity.anims.generateFrameNumbers(ASSET.PLAYER, { frames: [0] }),
      frameRate: FRAME_RATE,
      repeat: 0,
    });
    this.entity.anims.create({
      key: PLAYER_ANIM.WALK,
      frames: this.entity.anims.generateFrameNumbers(ASSET.PLAYER, { frames: [2, 3, 4, 1] }),
      frameRate: FRAME_RATE,
      repeat: -1,
    });
    // total animation length is 0.625s (5 frames at 8fps)
    // actual punch frame is 0.375s after start of animation (frame 3 / 5)
    this.entity.anims.create({
      key: PLAYER_ANIM.PUNCH,
      frames: this.entity.anims.generateFrameNumbers(ASSET.PLAYER, { frames: [5, 6, 7, 8, 5] }),
      frameRate: FRAME_RATE,
      repeat: 0,
    });
  }

  move({ x, y }: { x: number; y: number }) {
    const isMovingX = Math.abs(this.entity.x - x) > MOVEMENT_THRESHOLD;
    const isMovingY = Math.abs(this.entity.y - y) > MOVEMENT_THRESHOLD;
    const isMoving = isMovingX || isMovingY;

    if (isMovingX) {
      this.entity.setFlipX(this.entity.x > x);
    }

    this.entity.x = x;
    this.entity.y = y;
    this.nameText.x = x;
    this.nameText.y = y;

    if (!isMoving && !this.isPunching()) {
      this.entity.play(PLAYER_ANIM.IDLE);
    }
    if (isMoving && !(this.isPunching() || this.isWalking())) {
      this.entity.play(PLAYER_ANIM.WALK);
    }
  }

  punch() {
    if (this.isPunching()) return;
    this.entity.anims.play(PLAYER_ANIM.PUNCH);
  }

  stopPunch() {
    if (!this.isPunching()) return;
    this.entity.anims.stop();
  }

  isPunching() {
    return this.entity.anims.isPlaying && this.entity.anims.currentAnim?.key === PLAYER_ANIM.PUNCH;
  }

  isWalking() {
    return this.entity.anims.isPlaying && this.entity.anims.currentAnim?.key === PLAYER_ANIM.WALK;
  }

  destroy() {
    this.entity.destroy();
    this.nameText.destroy();
  }
}
