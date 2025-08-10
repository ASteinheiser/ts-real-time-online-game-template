import type { Room } from 'colyseus.js';
import type { Scene } from 'phaser';
import { CustomText } from './CustomText';
import { WS_EVENT } from '@repo/core-game';

export class PingDisplay {
  scene: Scene;
  room?: Room;
  pingStartTime = 0;
  currentPingMs = 0;
  timerEvent?: Phaser.Time.TimerEvent;
  pingText: CustomText;

  constructor(scene: Scene) {
    this.scene = scene;
    this.pingText = new CustomText(this.scene, 10, 10, 'Ping: --', { fontSize: '16px', color: '#00ff00' })
      .setOrigin(0, 0)
      .setScrollFactor(0);
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
    const pingText = `Ping: ${this.currentPingMs}ms`;

    this.pingText.setColor(color).setText(pingText);
  }

  getPingColor(pingMs: number): string {
    if (pingMs < 50) return '#00ff00';
    if (pingMs < 100) return '#ffff00';
    if (pingMs < 200) return '#ff8800';
    return '#ff0000';
  }

  destroy() {
    this.timerEvent?.remove();
    delete this.timerEvent;
    this.pingText.destroy();
  }
}
