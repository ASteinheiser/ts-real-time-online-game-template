import { Outlet } from 'react-router-dom';
import { useForcedAuthFlow, useNotifyOnURLHash, useIsAuthRoute } from '@repo/client-auth/router';
import { MAP_SIZE } from '@repo/core-game';
import { APP_ROUTES } from './constants';
import logo from '../assets/logo.png';

export const Layout = () => {
  const isAuthRoute = useIsAuthRoute();

  useForcedAuthFlow({
    alreadyLoggedInRedirectPath: APP_ROUTES.GAME,
  });
  useNotifyOnURLHash();

  return (
    <div className="fullscreen-center" style={{ width: MAP_SIZE.width, height: MAP_SIZE.height }}>
      {isAuthRoute && <img src={logo} className="h-30 w-auto mb-10 mt-[-40px]" />}

      <Outlet />
    </div>
  );
};
