import { Outlet } from 'react-router-dom';
import { useForcedAuthFlow, useNotifyOnURLHash } from '@repo/client-auth/router';
import { MAP_SIZE } from '@repo/core-game';
import { APP_ROUTES } from './constants';

export const Layout = () => {
  useForcedAuthFlow({
    alreadyLoggedInRedirectPath: APP_ROUTES.GAME,
  });
  useNotifyOnURLHash();

  return (
    <div className="fullscreen-center" style={{ width: MAP_SIZE.width, height: MAP_SIZE.height }}>
      <Outlet />
    </div>
  );
};
