export const ROOM_ERROR = {
  INVALID_TOKEN: 'Invalid or expired token',
  USER_ID_CHANGED: 'userId changed during token refresh',
  CONNECTION_NOT_FOUND: 'Connection not found',
  PROFILE_NOT_FOUND: 'Profile not found',
  TOKEN_EXPIRED: 'Token has expired',
  PLAYER_ALREADY_JOINED: 'Player already has an active connection to this room',
} as const;

export const REFRESH_TOKEN_ERRORS: string[] = [
  ROOM_ERROR.INVALID_TOKEN,
  ROOM_ERROR.CONNECTION_NOT_FOUND,
  ROOM_ERROR.USER_ID_CHANGED,
];
