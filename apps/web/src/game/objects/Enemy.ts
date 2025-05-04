// hardcode the enemy size for now
const HITBOX_SIZE = 64;

export class Enemy {
  entity: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  hitbox: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.entity = scene.physics.add.sprite(x, y, 'enemy');
    this.hitbox = scene.add.rectangle(x, y, HITBOX_SIZE, HITBOX_SIZE);
    this.hitbox.setStrokeStyle(1, 0xff00ff);
  }

  move(x: number, y: number) {
    this.entity.x = x;
    this.entity.y = y;
    this.hitbox.x = x;
    this.hitbox.y = y;
  }

  destroy() {
    this.entity?.destroy();
    this.hitbox?.destroy();
  }
}
