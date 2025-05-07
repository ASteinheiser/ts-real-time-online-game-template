import { describe, it, expect } from 'vitest';
import { calculateMovement } from '../src/calculate-movement';
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_MOVE_SPEED } from '../src/constants';

describe('calculateMovement', () => {
  const noMovementArgs = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  describe('when the entity is not moving', () => {
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

        const expectedPosition = {
          x: entity.x,
          y: entity.y,
        };

        expect(newPosition).toEqual(expectedPosition);
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

        const expectedPosition = {
          x: 0,
          y: 0,
        };

        expect(newPosition).toEqual(expectedPosition);
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

        const expectedPosition = {
          x: MAP_WIDTH,
          y: MAP_HEIGHT,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
  });

  describe('when the entity is moving left', () => {
    it('should return the entity to the left', () => {
      const entity = {
        x: MAP_WIDTH / 2,
        y: MAP_HEIGHT / 2,
      };

      const newPosition = calculateMovement({
        ...entity,
        ...noMovementArgs,
        left: true,
      });

      const expectedPosition = {
        x: entity.x - PLAYER_MOVE_SPEED,
        y: entity.y,
      };

      expect(newPosition).toEqual(expectedPosition);
    });

    describe('and the entity is at the edge of the map (x = 0)', () => {
      it('should return the entity to [0, y]', () => {
        const entity = {
          x: 0,
          y: MAP_HEIGHT / 2,
        };

        const newPosition = calculateMovement({
          ...entity,
          ...noMovementArgs,
          left: true,
        });

        const expectedPosition = {
          x: 0,
          y: entity.y,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
    describe('and the entity is moving right', () => {
      it('should not move the entity', () => {
        const entity = {
          x: MAP_WIDTH / 2,
          y: MAP_HEIGHT / 2,
        };

        const newPosition = calculateMovement({
          ...entity,
          ...noMovementArgs,
          left: true,
          right: true,
        });

        const expectedPosition = {
          x: entity.x,
          y: entity.y,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
    describe('and the entity is moving up', () => {
      it('should move the entity up and left', () => {
        const entity = {
          x: MAP_WIDTH / 2,
          y: MAP_HEIGHT / 2,
        };

        const newPosition = calculateMovement({
          ...entity,
          ...noMovementArgs,
          left: true,
          up: true,
        });

        const expectedPosition = {
          x: entity.x - PLAYER_MOVE_SPEED,
          y: entity.y - PLAYER_MOVE_SPEED,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
  });

  describe('when the entity is moving down', () => {
    it('should move the entity down', () => {
      const entity = {
        x: MAP_WIDTH / 2,
        y: MAP_HEIGHT / 2,
      };

      const newPosition = calculateMovement({
        ...entity,
        ...noMovementArgs,
        down: true,
      });

      const expectedPosition = {
        x: entity.x,
        y: entity.y + PLAYER_MOVE_SPEED,
      };

      expect(newPosition).toEqual(expectedPosition);
    });

    describe('and the entity is at the edge of the map (y = MAP_HEIGHT)', () => {
      it('should return the entity to [x, MAP_HEIGHT]', () => {
        const entity = {
          x: MAP_WIDTH / 2,
          y: MAP_HEIGHT,
        };

        const newPosition = calculateMovement({
          ...entity,
          ...noMovementArgs,
          down: true,
        });

        const expectedPosition = {
          x: entity.x,
          y: MAP_HEIGHT,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });

    describe('and the entity is moving up', () => {
      it('should not move the entity', () => {
        const entity = {
          x: MAP_WIDTH / 2,
          y: MAP_HEIGHT / 2,
        };

        const newPosition = calculateMovement({
          ...entity,
          ...noMovementArgs,
          down: true,
          up: true,
        });

        const expectedPosition = {
          x: entity.x,
          y: entity.y,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
    describe('and the entity is moving right', () => {
      it('should move the entity down and right', () => {
        const entity = {
          x: MAP_WIDTH / 2,
          y: MAP_HEIGHT / 2,
        };

        const newPosition = calculateMovement({
          ...entity,
          ...noMovementArgs,
          down: true,
          right: true,
        });

        const expectedPosition = {
          x: entity.x + PLAYER_MOVE_SPEED,
          y: entity.y + PLAYER_MOVE_SPEED,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
  });
});
