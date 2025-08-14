import { Outlet } from 'react-router-dom';
import { useForcedAuthFlow, useNotifyOnURLHash, AUTH_ROUTES, useIsAuthRoute } from '@repo/client-auth/router';
import { useStartAtTopOfPage } from '@repo/ui/hooks';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';

export const Layout = () => {
  const isAuthRoute = useIsAuthRoute();

  useForcedAuthFlow({
    alreadyLoggedInRedirectPath: AUTH_ROUTES.PROFILE,
    allowDeepLinkRedirectPage: true,
  });
  useNotifyOnURLHash();
  useStartAtTopOfPage();

  return (
    <>
      <TopNav />

      <div className="max-w-screen-lg mx-auto pt-nav">
        {isAuthRoute ? (
          <div className="fullscreen-center">
            <Outlet />
          </div>
        ) : (
          <Outlet />
        )}
      </div>

      <Footer />
    </>
  );
};
