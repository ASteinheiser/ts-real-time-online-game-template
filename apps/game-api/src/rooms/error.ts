export const ROOM_ERROR = {
  INVALID_TOKEN: 'Invalid or expired token',
  USER_ID_CHANGED: 'userId changed during token refresh',
  CONNECTION_NOT_FOUND: 'Connection not found',
  NEW_CONNECTION_FOUND: 'A new connection has been made for this user',
  PROFILE_NOT_FOUND: 'Profile not found',
  TOKEN_EXPIRED: 'Token has expired',
  PLAYER_INACTIVITY: 'Player kicked for inactivity',
  INVALID_PAYLOAD: 'Invalid message payload',
  INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;
