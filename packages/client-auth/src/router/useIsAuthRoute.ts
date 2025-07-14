import { useLocation } from 'react-router-dom';
import { AUTH_ROUTES } from '../router';

/** Checks if the current route is an auth route */
export const useIsAuthRoute = (): boolean => {
  const { pathname } = useLocation();
  return Object.values(AUTH_ROUTES as Record<string, string>).includes(pathname);
};
