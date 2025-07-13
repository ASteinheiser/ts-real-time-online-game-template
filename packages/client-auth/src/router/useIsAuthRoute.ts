import { useLocation } from 'react-router-dom';
import { AUTH_ROUTES } from '../router';

export const useIsAuthRoute = (): boolean => {
  const { pathname } = useLocation();
  return Object.values(AUTH_ROUTES as Record<string, string>).includes(pathname);
};
