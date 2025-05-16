import { AUTO, Game } from 'phaser';
import { MAP_WIDTH, MAP_HEIGHT } from '@repo/core-game';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#028af8',
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
