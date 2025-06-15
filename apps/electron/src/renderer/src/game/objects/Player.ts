// used to handle slight differences in player position due to interpolation of server values
const MOVEMENT_THRESHOLD = 0.1;

export class Player {
  entity: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  nameText: Phaser.GameObjects.Text;

  constructor(entity: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, nameText: Phaser.GameObjects.Text) {
    this.entity = entity;
    this.nameText = nameText;

    this.entity.anims.create({
      key: 'playerIdle',
      frames: this.entity.anims.generateFrameNumbers('player', { frames: [0] }),
      frameRate: 8,
      repeat: 0,
    });
    this.entity.anims.create({
      key: 'playerWalk',
      frames: this.entity.anims.generateFrameNumbers('player', { frames: [2, 3, 4, 1] }),
      frameRate: 8,
      repeat: -1,
    });
    // total animation length is 0.625s (5 frames at 8fps)
    // actual punch frame is 0.375s after start of animation (frame 3 / 5)
    this.entity.anims.create({
      key: 'playerPunch',
      frames: this.entity.anims.generateFrameNumbers('player', { frames: [5, 6, 7, 8, 5] }),
      frameRate: 8,
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
      this.entity.play('playerIdle');
    }
    if (isMoving && !(this.isPunching() || this.isWalking())) {
      this.entity.play('playerWalk');
    }
  }

  punch() {
    if (this.isPunching()) return;
    this.entity.anims.play('playerPunch');
  }

  stopPunch() {
    if (!this.isPunching()) return;
    this.entity.anims.stop();
  }

  isPunching() {
    return this.entity.anims.isPlaying && this.entity.anims.currentAnim?.key === 'playerPunch';
  }

  isWalking() {
    return this.entity.anims.isPlaying && this.entity.anims.currentAnim?.key === 'playerWalk';
  }

  destroy() {
    this.entity.destroy();
    this.nameText.destroy();
  }
}
