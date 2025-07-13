export const ROOM_ERROR = {
  INVALID_TOKEN: 'Invalid or expired token',
  USER_ID_CHANGED: 'userId changed during token refresh',
  CONNECTION_NOT_FOUND: 'Connection not found',
  PROFILE_NOT_FOUND: 'Profile not found',
  TOKEN_EXPIRED: 'Token has expired',
  PLAYER_ALREADY_JOINED: 'Player already has an active connection to this room',
  INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;
