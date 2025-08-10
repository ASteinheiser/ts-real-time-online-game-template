import type { Room } from 'colyseus.js';
import type { Scene } from 'phaser';
import { CustomText } from './CustomText';
import { WS_EVENT } from '@repo/core-game';

const MARGIN = 10;
const PADDING = 6;
const CORNER_RADIUS = 8;

export class PingDisplay {
  scene: Scene;
  room?: Room;
  pingStartTime = 0;
  currentPingMs = 0;
  timerEvent?: Phaser.Time.TimerEvent;
  background: Phaser.GameObjects.Graphics;
  pingText: CustomText;

  constructor(scene: Scene) {
    this.scene = scene;

    const x = this.scene.cameras.main.width - MARGIN;
    const y = MARGIN;
    this.pingText = new CustomText(this.scene, x, y, '--', {
      fontSize: '16px',
      color: '#00ff00',
    })
      .setOrigin(1, 0)
      .setScrollFactor(0);

    this.background = this.scene.add.graphics().setScrollFactor(0).setDepth(99);
    this.updateBackgroundSize();
  }

  start(room: Room) {
    this.room = room;

    this.room.onMessage(WS_EVENT.PONG, () => {
      this.currentPingMs = Date.now() - this.pingStartTime;
      this.updateDisplay();
    });

    this.timerEvent = this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.sendPing(),
    });
    // Start the first ping immediately
    this.sendPing();
  }

  sendPing() {
    if (!this.room || !this.room.connection.isOpen) return;
    this.pingStartTime = Date.now();
    this.room.send(WS_EVENT.PING);
  }

  updateDisplay() {
    const color = this.getPingColor(this.currentPingMs);
    const pingText = `${this.currentPingMs}ms`;

    this.pingText.setColor(color).setText(pingText);
    this.updateBackgroundSize();
  }

  getPingColor(pingMs: number): string {
    if (pingMs < 50) return '#00ff00';
    if (pingMs < 100) return '#ffff00';
    if (pingMs < 200) return '#ff8800';
    return '#ff0000';
  }

  updateBackgroundSize() {
    const bgWidth = this.pingText.displayWidth + PADDING * 2;
    const bgHeight = this.pingText.displayHeight + PADDING * 2;
    const bgX = this.pingText.x - bgWidth + PADDING;
    const bgY = this.pingText.y - PADDING;

    this.background.clear();
    this.background.fillStyle(0x000000, 0.5).fillRoundedRect(bgX, bgY, bgWidth, bgHeight, CORNER_RADIUS);
  }

  destroy() {
    this.timerEvent?.remove();
    delete this.timerEvent;
    this.pingText.destroy();
    this.background.destroy();
  }
}
