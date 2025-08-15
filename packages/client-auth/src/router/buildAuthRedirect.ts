import { AUTH_ROUTES, AUTH_SEARCH_PARAMS } from './constants';

const WEB_BASE_URL = import.meta.env.VITE_PUBLIC_WEB_BASE_URL;
const DEEP_LINK_PROTOCOL = import.meta.env.VITE_DEEP_LINK_PROTOCOL;
if (!WEB_BASE_URL) throw new Error('VITE_PUBLIC_WEB_BASE_URL must be set');
if (!DEEP_LINK_PROTOCOL) throw new Error('VITE_DEEP_LINK_PROTOCOL must be set');

/** Builds a redirect URL that either routes to web or deep links to the desktop app */
export const buildAuthRedirect = (path: string, isDesktop: boolean) => {
  const basePath = `${WEB_BASE_URL}${AUTH_ROUTES.REDIRECT}`;

  if (!isDesktop) {
    return `${basePath}?${AUTH_SEARCH_PARAMS.REDIRECT}=${encodeURIComponent(path)}`;
  }

  const deep = `${DEEP_LINK_PROTOCOL}://${path}`;
  return `${basePath}?${AUTH_SEARCH_PARAMS.DEEP_LINK}=${encodeURIComponent(deep)}`;
};
