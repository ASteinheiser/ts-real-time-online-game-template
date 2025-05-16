import { ATTACK_HEIGHT, ATTACK_WIDTH } from '@repo/core-game';

// how long the hitbox should be visible
const HITBOX_LIFETIME = 2000;

export class Hitbox {
  hitbox?: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
    this.hitbox = scene.add.rectangle(x, y, ATTACK_WIDTH, ATTACK_HEIGHT, color, 0.5).setDepth(100);

    scene.time.delayedCall(HITBOX_LIFETIME, () => {
      this.destroy();
    });
  }

  destroy() {
    this.hitbox?.destroy();
  }
}
