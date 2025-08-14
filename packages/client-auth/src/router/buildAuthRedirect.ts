import { AUTH_ROUTES, AUTH_REDIRECT_SEARCH_PARAM } from './constants';

const WEB_BASE_URL = import.meta.env.VITE_PUBLIC_WEB_BASE_URL;
const DEEP_LINK_PROTOCOL = import.meta.env.VITE_DEEP_LINK_PROTOCOL;
if (!WEB_BASE_URL) throw new Error('VITE_PUBLIC_WEB_BASE_URL must be set');
if (!DEEP_LINK_PROTOCOL) throw new Error('VITE_DEEP_LINK_PROTOCOL must be set');

/** Builds a redirect URL that either routes to web or deep links to the desktop app */
export const buildAuthRedirect = (path: string, isDesktop: boolean) => {
  if (!isDesktop) {
    return `${WEB_BASE_URL}${path}`;
  }
  const deep = `${DEEP_LINK_PROTOCOL}://${path}`;
  return `${WEB_BASE_URL}${AUTH_ROUTES.REDIRECT}?${AUTH_REDIRECT_SEARCH_PARAM}=${encodeURIComponent(deep)}`;
};
