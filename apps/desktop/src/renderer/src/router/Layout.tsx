import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useForcedAuthFlow, useNotifyOnURLHash, useIsAuthRoute } from '@repo/client-auth/router';
import { Settings } from '@repo/ui/icons';
import { MAP_SIZE } from '@repo/core-game';
import { APP_ROUTES } from './constants';
import logo from '../assets/logo.png';
import { OptionsModal } from '../modals/OptionsModal';

export const Layout = () => {
  const isAuthRoute = useIsAuthRoute();
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  useForcedAuthFlow({
    alreadyLoggedInRedirectPath: APP_ROUTES.GAME,
  });
  useNotifyOnURLHash();

  return (
    <div className="fullscreen-center" style={{ width: MAP_SIZE.width, height: MAP_SIZE.height }}>
      {isAuthRoute && (
        <>
          <div className="fixed top-6 right-6 z-2 cursor-pointer" onClick={() => setIsOptionsModalOpen(true)}>
            <Settings className="text-muted" size={36} />
          </div>

          <OptionsModal isOpen={isOptionsModalOpen} onOpenChange={setIsOptionsModalOpen} />

          <img src={logo} className="h-30 w-auto mb-10 mt-[-40px]" />
        </>
      )}

      <Outlet />
    </div>
  );
};
