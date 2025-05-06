// #region Game
// this is how many ticks per second the game has
export const FIXED_TIME_STEP = 1000 / 128;
// #endregion

// #region Map
export const MAP_WIDTH = 1024;
export const MAP_HEIGHT = 768;
// #endregion

// #region Player
export const PLAYER_MOVE_SPEED = 2;
export const PLAYER_WIDTH = 47;
export const PLAYER_HEIGHT = 53;
// #endregion

// #region Attack
export const ATTACK_WIDTH = 6;
export const ATTACK_HEIGHT = 8;
// offset from the center of the player to the center of the fist,
// which is at the edge of the player's bounding box
export const ATTACK_OFFSET_X = PLAYER_WIDTH / 2 - ATTACK_WIDTH / 2;
// magic number, this is how high the fist is above the center of the player
export const ATTACK_OFFSET_Y = 12.5;
// attack animation takes 0.625 seconds total (5 frames at 8fps)
export const ATTACK_COOLDOWN = 625;
// attack damage frame is at .375 seconds (frame 3 / 5)
export const ATTACK_DAMAGE__DELAY = 375;
// time it takes for one frame in the attack animation (8fps)
export const ATTACK_DAMAGE__FRAME_TIME = 125;
// #endregion

// #region Enemy
export const ENEMY_SPAWN_RATE = 2000;
export const MAX_ENEMIES = 10;
export const ENEMY_WIDTH = 64;
export const ENEMY_HEIGHT = 64;
// #endregion
