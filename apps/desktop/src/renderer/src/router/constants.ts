export const SEARCH_PARAMS = {
  SETTINGS: 'settings',
  PROFILE: 'editProfile',
  NEW_PASSWORD: 'newPassword',
} as const;

export const APP_ROUTES = {
  GAME: '/',
  /** shim to render form as a modal controlled by search params */
  PROFILE: `/?${SEARCH_PARAMS.PROFILE}=true`,
  /** shim to render form as a modal controlled by search params */
  NEW_PASSWORD: `/?${SEARCH_PARAMS.NEW_PASSWORD}=true`,
} as const;
