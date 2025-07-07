import { Events } from 'phaser';

// Used to emit events between React components and Phaser scenes
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Events.EventEmitter
export const EventBus = new Events.EventEmitter();

export const EVENT_BUS = {
  CURRENT_SCENE_READY: 'current-scene-ready',
  GAME_START: 'game-start',
  JOIN_ERROR: 'join-error',
  PROFILE_OPEN: 'menu-open__profile',
  OPTIONS_OPEN: 'menu-open__options',
};
