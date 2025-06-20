import { Outlet } from 'react-router-dom';
import { useForcedAuthFlow, useNotifyOnURLHash, AUTH_ROUTES } from '@repo/client-auth/router';
import { useStartAtTopOfPage } from '@repo/ui/hooks';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';

export const Layout = () => {
  useForcedAuthFlow({
    alreadyLoggedInRedirectPath: AUTH_ROUTES.PROFILE,
  });
  useNotifyOnURLHash();
  useStartAtTopOfPage();

  return (
    <>
      <TopNav />

      <div className="max-w-screen-lg mx-auto pt-nav">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};
