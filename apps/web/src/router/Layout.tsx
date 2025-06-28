import { Outlet, useLocation } from 'react-router-dom';
import { useForcedAuthFlow, useNotifyOnURLHash, AUTH_ROUTES } from '@repo/client-auth/router';
import { useStartAtTopOfPage } from '@repo/ui/hooks';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';

export const Layout = () => {
  const { pathname } = useLocation();
  const isAuthRoute = Object.values(AUTH_ROUTES).includes(pathname);

  useForcedAuthFlow({
    alreadyLoggedInRedirectPath: AUTH_ROUTES.PROFILE,
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
