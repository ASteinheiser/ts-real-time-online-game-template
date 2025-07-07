import { AUTO, Game } from 'phaser';
import { MAP_SIZE } from '@repo/core-game';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';

export const GAME_CONTAINER_ID = 'game-container';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: MAP_SIZE.width,
  height: MAP_SIZE.height,
  parent: GAME_CONTAINER_ID,
  backgroundColor: '#09090b',
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  pixelArt: true,
};

export const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};
