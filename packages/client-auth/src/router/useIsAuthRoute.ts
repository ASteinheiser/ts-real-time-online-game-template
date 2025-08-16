import { useLocation } from 'react-router-dom';
import { AUTH_ROUTES } from '../router';

const AUTH_ROUTES_ARRAY = Object.values(AUTH_ROUTES) as string[];

/** Checks if the current route is an auth route */
export const useIsAuthRoute = (): boolean => {
  const { pathname } = useLocation();
  return AUTH_ROUTES_ARRAY.includes(pathname);
};
