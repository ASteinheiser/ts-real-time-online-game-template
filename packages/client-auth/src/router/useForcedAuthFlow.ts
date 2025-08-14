import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../provider/SessionContext';
import { AUTH_ROUTES, AUTH_PATH_PREFIX } from './constants';

interface UseForcedAuthFlowProps {
  alreadyLoggedInRedirectPath: string;
  /** allows the deep link redirect page to be used, which will skip any redirects so the webpage can open the native app */
  allowDeepLinkRedirectPage?: boolean;
}

/** Handles app forced navigation flows, primarily used for routing based on certain auth states */
export const useForcedAuthFlow = ({
  alreadyLoggedInRedirectPath,
  allowDeepLinkRedirectPage = false,
}: UseForcedAuthFlowProps) => {
  const { session, profile, isPasswordRecovery } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const navigateTo = (path: string) => {
      if (location.pathname !== path) navigate(path);
    };

    if (allowDeepLinkRedirectPage && location.pathname === AUTH_ROUTES.REDIRECT) {
      return;
    } else if (session && isPasswordRecovery) {
      navigateTo(AUTH_ROUTES.NEW_PASSWORD);
    } else if (session && !isPasswordRecovery && location.pathname === AUTH_ROUTES.NEW_PASSWORD) {
      navigateTo(alreadyLoggedInRedirectPath);
    } else if (session && !profile) {
      navigateTo(AUTH_ROUTES.CREATE_PROFILE);
    } else if (session && profile && location.pathname === AUTH_ROUTES.CREATE_PROFILE) {
      navigateTo(alreadyLoggedInRedirectPath);
    } else if (session && location.pathname.includes(AUTH_PATH_PREFIX)) {
      navigateTo(alreadyLoggedInRedirectPath);
    }
  }, [session, profile, isPasswordRecovery, location.pathname]);
};
