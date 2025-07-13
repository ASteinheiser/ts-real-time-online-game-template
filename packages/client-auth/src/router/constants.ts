export const AUTH_PATH_PREFIX = '/auth/';

export const AUTH_ROUTES = {
  LOGIN: `${AUTH_PATH_PREFIX}login`,
  SIGNUP: `${AUTH_PATH_PREFIX}signup`,
  FORGOT_PASSWORD: `${AUTH_PATH_PREFIX}forgot-password`,
  NEW_PASSWORD: `${AUTH_PATH_PREFIX}new-password`,
  CREATE_PROFILE: '/create-profile',
  PROFILE: '/profile',
} as const;
