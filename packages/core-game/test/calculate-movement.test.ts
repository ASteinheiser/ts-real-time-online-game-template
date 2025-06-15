import { describe, it, expect } from 'vitest';
import { calculateMovement } from '../src/calculate-movement';
import { MAP_SIZE, PLAYER_MOVE_SPEED } from '../src/constants';

describe('calculateMovement', () => {
  const noEntitySize = {
    width: 0,
    height: 0,
  };
  const noMovementArgs = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  describe('when the entity is not moving', () => {
    describe('and the entity is in bounds', () => {
      it('should return the same position', () => {
        const entityPosition = {
          x: MAP_SIZE.width / 2,
          y: MAP_SIZE.height / 2,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
        });

        const expectedPosition = {
          x: entityPosition.x,
          y: entityPosition.y,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
    describe('and the entity is out of bounds (y < 0 and x < 0)', () => {
      it('should return the entity to [0,0]', () => {
        const entityPosition = {
          x: -100,
          y: -100,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
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
        const entityPosition = {
          x: MAP_SIZE.width + 100,
          y: MAP_SIZE.height + 100,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
        });

        const expectedPosition = {
          x: MAP_SIZE.width,
          y: MAP_SIZE.height,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
  });

  describe('when the entity is moving left', () => {
    it('should return the entity to the left', () => {
      const entityPosition = {
        x: MAP_SIZE.width / 2,
        y: MAP_SIZE.height / 2,
      };

      const newPosition = calculateMovement({
        ...entityPosition,
        ...noEntitySize,
        ...noMovementArgs,
        left: true,
      });

      const expectedPosition = {
        x: entityPosition.x - PLAYER_MOVE_SPEED,
        y: entityPosition.y,
      };

      expect(newPosition).toEqual(expectedPosition);
    });

    describe('and the entity is at the edge of the map (x = 0)', () => {
      it('should return the entity to [0, y]', () => {
        const entityPosition = {
          x: 0,
          y: MAP_SIZE.height / 2,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
          left: true,
        });

        const expectedPosition = {
          x: 0,
          y: entityPosition.y,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
    describe('and the entity is moving right', () => {
      it('should not move the entity', () => {
        const entityPosition = {
          x: MAP_SIZE.width / 2,
          y: MAP_SIZE.height / 2,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
          left: true,
          right: true,
        });

        const expectedPosition = {
          x: entityPosition.x,
          y: entityPosition.y,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
    describe('and the entity is moving up', () => {
      it('should move the entity up and left', () => {
        const entityPosition = {
          x: MAP_SIZE.width / 2,
          y: MAP_SIZE.height / 2,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
          left: true,
          up: true,
        });

        const expectedPosition = {
          x: entityPosition.x - PLAYER_MOVE_SPEED,
          y: entityPosition.y - PLAYER_MOVE_SPEED,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
  });

  describe('when the entity is moving down', () => {
    it('should move the entity down', () => {
      const entityPosition = {
        x: MAP_SIZE.width / 2,
        y: MAP_SIZE.height / 2,
      };

      const newPosition = calculateMovement({
        ...entityPosition,
        ...noEntitySize,
        ...noMovementArgs,
        down: true,
      });

      const expectedPosition = {
        x: entityPosition.x,
        y: entityPosition.y + PLAYER_MOVE_SPEED,
      };

      expect(newPosition).toEqual(expectedPosition);
    });

    describe('and the entity is at the edge of the map (y = MAP_HEIGHT)', () => {
      it('should return the entity to [x, MAP_HEIGHT]', () => {
        const entityPosition = {
          x: MAP_SIZE.width / 2,
          y: MAP_SIZE.height,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
          down: true,
        });

        const expectedPosition = {
          x: entityPosition.x,
          y: MAP_SIZE.height,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });

    describe('and the entity is moving up', () => {
      it('should not move the entity', () => {
        const entityPosition = {
          x: MAP_SIZE.width / 2,
          y: MAP_SIZE.height / 2,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
          down: true,
          up: true,
        });

        const expectedPosition = {
          x: entityPosition.x,
          y: entityPosition.y,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
    describe('and the entity is moving right', () => {
      it('should move the entity down and right', () => {
        const entityPosition = {
          x: MAP_SIZE.width / 2,
          y: MAP_SIZE.height / 2,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
          down: true,
          right: true,
        });

        const expectedPosition = {
          x: entityPosition.x + PLAYER_MOVE_SPEED,
          y: entityPosition.y + PLAYER_MOVE_SPEED,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
  });

  describe('when the entity is moving right', () => {
    it('should move the entity right', () => {
      const entityPosition = {
        x: MAP_SIZE.width / 2,
        y: MAP_SIZE.height / 2,
      };

      const newPosition = calculateMovement({
        ...entityPosition,
        ...noEntitySize,
        ...noMovementArgs,
        right: true,
      });

      const expectedPosition = {
        x: entityPosition.x + PLAYER_MOVE_SPEED,
        y: entityPosition.y,
      };

      expect(newPosition).toEqual(expectedPosition);
    });

    describe('and the entity is at the edge of the map (x = MAP_WIDTH)', () => {
      it('should return the entity to [MAP_WIDTH, y]', () => {
        const entityPosition = {
          x: MAP_SIZE.width,
          y: MAP_SIZE.height / 2,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
          right: true,
        });

        const expectedPosition = {
          x: MAP_SIZE.width,
          y: entityPosition.y,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
  });

  describe('when the entity is moving up', () => {
    it('should move the entity up', () => {
      const entityPosition = {
        x: MAP_SIZE.width / 2,
        y: MAP_SIZE.height / 2,
      };

      const newPosition = calculateMovement({
        ...entityPosition,
        ...noEntitySize,
        ...noMovementArgs,
        up: true,
      });

      const expectedPosition = {
        x: entityPosition.x,
        y: entityPosition.y - PLAYER_MOVE_SPEED,
      };

      expect(newPosition).toEqual(expectedPosition);
    });

    describe('and the entity is at the edge of the map (y = 0)', () => {
      it('should return the entity to [x, 0]', () => {
        const entityPosition = {
          x: MAP_SIZE.width / 2,
          y: 0,
        };

        const newPosition = calculateMovement({
          ...entityPosition,
          ...noEntitySize,
          ...noMovementArgs,
          up: true,
        });

        const expectedPosition = {
          x: entityPosition.x,
          y: 0,
        };

        expect(newPosition).toEqual(expectedPosition);
      });
    });
  });

  describe('when the entity is moving in all directions', () => {
    it('should not move the entity', () => {
      const entityPosition = {
        x: MAP_SIZE.width / 2,
        y: MAP_SIZE.height / 2,
      };

      const newPosition = calculateMovement({
        ...entityPosition,
        ...noEntitySize,
        left: true,
        right: true,
        up: true,
        down: true,
      });

      const expectedPosition = {
        x: entityPosition.x,
        y: entityPosition.y,
      };

      expect(newPosition).toEqual(expectedPosition);
    });
  });

  describe('when the entity is at the edge of the map', () => {
    describe('and the entity size is 50 x 50', () => {
      const entitySize = {
        width: 50,
        height: 50,
      };
      describe('and the entity is moving down and right', () => {
        it('should move the entity back to the edge of the map according to the entity size', () => {
          const entityPosition = {
            x: MAP_SIZE.width,
            y: MAP_SIZE.height,
          };

          const newPosition = calculateMovement({
            ...entityPosition,
            ...entitySize,
            ...noMovementArgs,
            down: true,
            right: true,
          });

          const expectedPosition = {
            x: MAP_SIZE.width - entitySize.width / 2,
            y: MAP_SIZE.height - entitySize.height / 2,
          };

          expect(newPosition).toEqual(expectedPosition);
        });
      });
      describe('and the entity is moving up and left', () => {
        it('should move the entity back to the edge of the map according to the entity size', () => {
          const entityPosition = {
            x: 0,
            y: 0,
          };

          const newPosition = calculateMovement({
            ...entityPosition,
            ...entitySize,
            ...noMovementArgs,
            up: true,
            left: true,
          });

          const expectedPosition = {
            x: entitySize.width / 2,
            y: entitySize.height / 2,
          };

          expect(newPosition).toEqual(expectedPosition);
        });
      });
    });

    describe('and the entity size is 37 x 96', () => {
      const entitySize = {
        width: 37,
        height: 96,
      };
      describe('and the entity is moving down and right', () => {
        it('should move the entity back to the edge of the map according to the entity size', () => {
          const entityPosition = {
            x: MAP_SIZE.width,
            y: MAP_SIZE.height,
          };

          const newPosition = calculateMovement({
            ...entityPosition,
            ...entitySize,
            ...noMovementArgs,
            down: true,
            right: true,
          });

          const expectedPosition = {
            x: MAP_SIZE.width - entitySize.width / 2,
            y: MAP_SIZE.height - entitySize.height / 2,
          };

          expect(newPosition).toEqual(expectedPosition);
        });
      });
      describe('and the entity is moving up and left', () => {
        it('should move the entity back to the edge of the map according to the entity size', () => {
          const entityPosition = {
            x: 0,
            y: 0,
          };

          const newPosition = calculateMovement({
            ...entityPosition,
            ...entitySize,
            ...noMovementArgs,
            up: true,
            left: true,
          });

          const expectedPosition = {
            x: entitySize.width / 2,
            y: entitySize.height / 2,
          };

          expect(newPosition).toEqual(expectedPosition);
        });
      });
    });
  });
});
