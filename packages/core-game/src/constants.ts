// #region Game
// this is how many ticks per second the game has
export const FIXED_TIME_STEP = 1000 / 128;
// #endregion

// #region Map
export const MAP_SIZE = {
  width: 1024,
  height: 768,
};
// #endregion

// #region Player
export const PLAYER_MOVE_SPEED = 2;
export const PLAYER_SIZE = {
  width: 47,
  height: 53,
};
// #endregion

// #region Attack
export const ATTACK_SIZE = {
  width: 6,
  height: 8,
};
// offset from the center of the player to the center of the fist,
// which is at the edge of the player's bounding box
export const ATTACK_OFFSET_X = PLAYER_SIZE.width / 2 - ATTACK_SIZE.width / 2;
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
export const ENEMY_SIZE = {
  width: 64,
  height: 64,
};
// #endregion

// #region API Server
export const API_ROUTES = {
  GRAPHQL: '/graphql',
  MONITOR: '/monitor',
  PLAYGROUND: '/',
} as const;

export const WS_ROOM = {
  GAME_ROOM: 'game_room',
} as const;

export const WS_EVENT = {
  LEAVE_ROOM: 'leaveRoom',
  PLAYER_INPUT: 'playerInput',
  REFRESH_TOKEN: 'refreshToken',
  // this comes from Colyseus, register this to handle playground messages
  PLAYGROUND_MESSAGE_TYPES: '__playground_message_types',
} as const;

export const WS_CODE = {
  SUCCESS: 1000,
  INTERNAL_SERVER_ERROR: 1011,
  UNAUTHORIZED: 3000,
  FORBIDDEN: 3003,
  TIMEOUT: 3008,
  NOT_FOUND: 4004,
} as const;

export interface AuthPayload {
  token: string;
}

export interface InputPayload {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
}
// #endregion
