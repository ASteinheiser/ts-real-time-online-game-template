import { describe, it, expect } from 'vitest';
import {
  PLAYER_MOVE_SPEED,
  PLAYER_SIZE,
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
    describe('PLAYER_MOVE_SPEED', () => {
      it('should be a number', () => {
        expect(typeof PLAYER_MOVE_SPEED).toBe('number');
      });
    });
    describe('PLAYER_SIZE', () => {
      it('should be an object', () => {
        expect(typeof PLAYER_SIZE).toBe('object');
      });
    });
    describe('PLAYER_SIZE.width', () => {
      it('should be a number', () => {
        expect(typeof PLAYER_SIZE.width).toBe('number');
      });
    });
    describe('PLAYER_SIZE.height', () => {
      it('should be a number', () => {
        expect(typeof PLAYER_SIZE.height).toBe('number');
      });
    });
  });
});
