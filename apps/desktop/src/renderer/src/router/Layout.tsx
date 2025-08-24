import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useForcedAuthFlow, useNotifyOnURLHash, useIsAuthRoute } from '@repo/client-auth/router';
import { Settings } from '@repo/ui/icons';
import logo from '../assets/logo.png';
import { SettingsModal } from '../modals/SettingsModal';
import { useDeepLinks } from './useDeepLinks';
import { APP_ROUTES } from './constants';

export const Layout = () => {
  const isAuthRoute = useIsAuthRoute();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useDeepLinks();
  useForcedAuthFlow({
    alreadyLoggedInRedirectPath: APP_ROUTES.GAME,
  });
  useNotifyOnURLHash();

  return (
    <div className="fullscreen-center">
      {isAuthRoute && (
        <>
          <div
            className="fixed top-6 right-6 z-2 cursor-pointer"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <Settings className="text-muted" size={36} />
          </div>

          <SettingsModal isOpen={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen} />

          <img src={logo} className="h-30 w-auto mb-10 mt-[-40px]" />
        </>
      )}

      <Outlet />
    </div>
  );
};
