export const AUTH_PATH_PREFIX = '/auth/';
export const PROFILE_PATH_PREFIX = '/profile/';

export const AUTH_ROUTES = {
  /** used for native app deep linking */
  REDIRECT: `${AUTH_PATH_PREFIX}redirect`,
  LOGIN: `${AUTH_PATH_PREFIX}login`,
  SIGNUP: `${AUTH_PATH_PREFIX}signup`,
  FORGOT_PASSWORD: `${AUTH_PATH_PREFIX}forgot-password`,
  NEW_PASSWORD: `${PROFILE_PATH_PREFIX}new-password`,
  CREATE_PROFILE: `${PROFILE_PATH_PREFIX}create`,
  PROFILE: `${PROFILE_PATH_PREFIX}edit`,
} as const;

export const AUTH_SEARCH_PARAMS = {
  /** used for web auth redirects */
  REDIRECT: 'redirect',
  /** used for native app deep linking */
  DEEP_LINK: 'deepLink',
  /** used for PKCE flow (supabase automatically appends this to the URL, we just consume it) */
  CODE: 'code',
} as const;
