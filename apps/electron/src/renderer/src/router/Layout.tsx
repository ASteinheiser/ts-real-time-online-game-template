import { Outlet } from 'react-router-dom';
import { useForcedAuthFlow, useNotifyOnURLHash } from '@repo/client-auth/router';
import { useStartAtTopOfPage } from '@repo/ui/hooks';
import { APP_ROUTES } from './constants';

export const Layout = () => {
  useForcedAuthFlow({
    alreadyLoggedInRedirectPath: APP_ROUTES.GAME,
  });
  useNotifyOnURLHash();
  useStartAtTopOfPage();

  return (
    <div className="mx-auto">
      <Outlet />
    </div>
  );
};
