/** The number of ticks per second the game has */
export const FIXED_TIME_STEP = 1000 / 128;

/** The size of the map in pixels */
export const MAP_SIZE = {
  width: 1024,
  height: 768,
};

/** The number of frames per second the player animates at (8fps) */
export const PLAYER_FRAME_RATE = 8;
/** The speed of the player in pixels per tick */
export const PLAYER_MOVE_SPEED = 2;
/** The size of the player in pixels */
export const PLAYER_SIZE = {
  width: 47,
  height: 53,
};

/** The size of the attack in pixels */
export const ATTACK_SIZE = {
  width: 6,
  height: 8,
};
/** Offset from the center of the player to the center of the fist,
 * which is at the edge of the player's bounding box */
export const ATTACK_OFFSET_X = PLAYER_SIZE.width / 2 - ATTACK_SIZE.width / 2;
/** Magic number, this is how high the fist is above the center of the player */
export const ATTACK_OFFSET_Y = 12.5;
/** Attack animation takes 0.625 seconds total (5 frames at 8fps) */
export const ATTACK_COOLDOWN = 625;
/** Attack damage frame is at 0.375 seconds (frame 3 / 5) */
export const ATTACK_DAMAGE__DELAY = 375;
/** Time it takes for one frame in the attack animation (in ms) */
export const ATTACK_DAMAGE__FRAME_TIME = 125;

/** The rate at which enemies spawn (in ms) */
export const ENEMY_SPAWN_RATE = 2000;
/** The maximum number of enemies that can exist */
export const MAX_ENEMIES = 10;
/** The size of the enemy in pixels */
export const ENEMY_SIZE = {
  width: 64,
  height: 64,
};

/** The routes for the API server */
export const API_ROUTES = {
  GRAPHQL: '/graphql',
  MONITOR: '/monitor',
  PLAYGROUND: '/',
} as const;
/** The websocket rooms available */
export const WS_ROOM = {
  GAME_ROOM: 'game_room',
} as const;
/** The websocket message events available */
export const WS_EVENT = {
  LEAVE_ROOM: 'leaveRoom',
  PLAYER_INPUT: 'playerInput',
  REFRESH_TOKEN: 'refreshToken',
  /** This comes from Colyseus, register this to handle playground messages */
  PLAYGROUND_MESSAGE_TYPES: '__playground_message_types',
} as const;
/** The websocket message codes available */
export const WS_CODE = {
  SUCCESS: 1000,
  INTERNAL_SERVER_ERROR: 1011,
  UNAUTHORIZED: 3000,
  FORBIDDEN: 3003,
  TIMEOUT: 3008,
  NOT_FOUND: 4004,
} as const;
/** The timeout for the connection to the server */
export const PLAYER_INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds
/** The interval at which the server will check for inactive players */
export const CONNECTION_CHECK_INTERVAL = 5 * 1000; // 5 seconds
/** The payload for joining a room or refreshing a token */
export interface AuthPayload {
  token: string;
}
/** The payload for player input */
export interface InputPayload {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
}
