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
  const { session, profile } = useSession();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const navigateTo = (newPath: string) => {
      if (pathname !== newPath) navigate(newPath);
    };

    if (allowDeepLinkRedirectPage && pathname === AUTH_ROUTES.REDIRECT) {
      return;
    } else if (session && !profile) {
      navigateTo(AUTH_ROUTES.CREATE_PROFILE);
    } else if (session && profile && pathname === AUTH_ROUTES.CREATE_PROFILE) {
      navigateTo(alreadyLoggedInRedirectPath);
    } else if (session && pathname.includes(AUTH_PATH_PREFIX)) {
      navigateTo(alreadyLoggedInRedirectPath);
    }
  }, [session, profile, pathname]);
};
