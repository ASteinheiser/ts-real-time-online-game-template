import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../provider/SessionContext';
import { AUTH_ROUTES, AUTH_PATH_PREFIX } from './constants';

export const useForcedAuthFlow = () => {
  const { session, profile, isPasswordRecovery } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const navigateTo = (path: string) => {
      if (location.pathname !== path) navigate(path);
    };
    // handle app forced navigation flows (auth, profile creation, etc)
    if (session && isPasswordRecovery) {
      navigateTo(AUTH_ROUTES.NEW_PASSWORD);
    } else if (session && !isPasswordRecovery && location.pathname === AUTH_ROUTES.NEW_PASSWORD) {
      navigateTo(AUTH_ROUTES.PROFILE);
    } else if (session && !profile) {
      navigateTo(AUTH_ROUTES.CREATE_PROFILE);
    } else if (session && profile && location.pathname === AUTH_ROUTES.CREATE_PROFILE) {
      navigateTo(AUTH_ROUTES.PROFILE);
    } else if (session && location.pathname.includes(AUTH_PATH_PREFIX)) {
      navigateTo(AUTH_ROUTES.PROFILE);
    }
  }, [session, profile, isPasswordRecovery, location.pathname]);
};
