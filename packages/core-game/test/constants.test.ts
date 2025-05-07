import { describe, it, expect } from 'vitest';
import { PLAYER_MOVE_SPEED, PLAYER_WIDTH, PLAYER_HEIGHT } from '../src/constants';

describe('constants', () => {
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
