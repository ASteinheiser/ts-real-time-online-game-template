import { PLAYER_MOVE_SPEED, MAP_WIDTH, MAP_HEIGHT } from './constants';

export interface EntityPosition {
  x: number;
  y: number;
}

export interface MovementInput {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export type CalculateMovementArgs = EntityPosition & MovementInput;
export type CalculateMovementResult = EntityPosition;

export const calculateMovement = ({
  x,
  y,
  left,
  right,
  up,
  down,
}: CalculateMovementArgs): CalculateMovementResult => {
  let newX = x;
  let newY = y;

  if (!(left && right)) {
    if (left) newX -= PLAYER_MOVE_SPEED;
    if (right) newX += PLAYER_MOVE_SPEED;
  }
  if (!(up && down)) {
    if (up) newY -= PLAYER_MOVE_SPEED;
    if (down) newY += PLAYER_MOVE_SPEED;
  }

  if (newX < 0) newX = 0;
  if (newX > MAP_WIDTH) newX = MAP_WIDTH;
  if (newY < 0) newY = 0;
  if (newY > MAP_HEIGHT) newY = MAP_HEIGHT;

  return { x: newX, y: newY };
};
