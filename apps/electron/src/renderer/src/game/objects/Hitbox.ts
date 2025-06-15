import { ATTACK_SIZE } from '@repo/core-game';

// how long the hitbox should be visible
const HITBOX_LIFETIME = 2000;

export class Hitbox {
  hitbox?: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
    const { width, height } = ATTACK_SIZE;
    this.hitbox = scene.add.rectangle(x, y, width, height, color, 0.5).setDepth(100);

    scene.time.delayedCall(HITBOX_LIFETIME, () => {
      this.destroy();
    });
  }

  destroy() {
    this.hitbox?.destroy();
  }
}
