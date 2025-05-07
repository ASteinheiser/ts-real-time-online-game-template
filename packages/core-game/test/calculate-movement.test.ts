import { describe, it, expect } from 'vitest';
import { calculateMovement } from '../src/calculate-movement';
import { MAP_WIDTH, MAP_HEIGHT } from '../src/constants';

describe('core-game', () => {
  describe('calculateMovement', () => {
    describe('when the entity is not moving', () => {
      const noMovementArgs = {
        left: false,
        right: false,
        up: false,
        down: false,
      };

      describe('and the entity is in bounds', () => {
        it('should return the same position', () => {
          const entity = {
            x: MAP_WIDTH / 2,
            y: MAP_HEIGHT / 2,
          };

          const newPosition = calculateMovement({
            ...entity,
            ...noMovementArgs,
          });

          expect(newPosition).toEqual({ x: entity.x, y: entity.y });
        });
      });
      describe('and the entity is out of bounds (y < 0 and x < 0)', () => {
        it('should return the entity to [0,0]', () => {
          const entity = {
            x: -100,
            y: -100,
          };

          const newPosition = calculateMovement({
            ...entity,
            ...noMovementArgs,
          });

          expect(newPosition).toEqual({ x: 0, y: 0 });
        });
      });
      describe('and the entity is out of bounds (y > MAP_HEIGHT and x > MAP_WIDTH)', () => {
        it('should return the entity to [MAP_WIDTH, MAP_HEIGHT]', () => {
          const entity = {
            x: MAP_WIDTH + 100,
            y: MAP_HEIGHT + 100,
          };

          const newPosition = calculateMovement({
            ...entity,
            ...noMovementArgs,
          });

          expect(newPosition).toEqual({ x: MAP_WIDTH, y: MAP_HEIGHT });
        });
      });
    });
  });
});
