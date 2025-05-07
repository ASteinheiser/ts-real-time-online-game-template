import { describe, it, expect } from 'vitest';
import {
  PLAYER_MOVE_SPEED,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  FIXED_TIME_STEP,
  MAP_WIDTH,
  MAP_HEIGHT,
} from '../src/constants';

describe('constants', () => {
  describe('game', () => {
    describe('FIXED_TIME_STEP', () => {
      it('should be a number', () => {
        expect(typeof FIXED_TIME_STEP).toBe('number');
      });
    });
  });

  describe('map', () => {
    describe('MAP_WIDTH', () => {
      it('should be a number', () => {
        expect(typeof MAP_WIDTH).toBe('number');
      });
    });
    describe('MAP_HEIGHT', () => {
      it('should be a number', () => {
        expect(typeof MAP_HEIGHT).toBe('number');
      });
    });
  });

  describe('player', () => {
    describe('PLAYER_WIDTH', () => {
      it('should be a number', () => {
        expect(typeof PLAYER_WIDTH).toBe('number');
      });
    });
    describe('PLAYER_HEIGHT', () => {
      it('should be a number', () => {
        expect(typeof PLAYER_HEIGHT).toBe('number');
      });
    });
    describe('PLAYER_MOVE_SPEED', () => {
      it('should be a number', () => {
        expect(typeof PLAYER_MOVE_SPEED).toBe('number');
      });
    });
  });
});
