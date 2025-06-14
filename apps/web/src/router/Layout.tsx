import { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@repo/ui';
import { useSession, SUPABASE_AUTH } from '@repo/client-auth/provider';
import { AUTH_ROUTES, AUTH_PATH_PREFIX } from '@repo/client-auth/router';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hashToastRef = useRef('');

  const { session, profile, isPasswordRecovery } = useSession();

  // ensure the user starts at the top of the page when navigating
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);

  useEffect(() => {
    const navigateTo = (path: string) => {
      if (location.pathname !== path) navigate(path);
    };
    // handle app forced navigation flows (auth, profile creation, etc)
    if (session && isPasswordRecovery) {
      navigateTo(AUTH_ROUTES.NEW_PASSWORD);
    } else if (session && !isPasswordRecovery && location.pathname === AUTH_ROUTES.NEW_PASSWORD) {
      navigateTo(AUTH_ROUTES.PROFILE);
    } else if (session && !profile) {
      navigateTo(AUTH_ROUTES.CREATE_PROFILE);
    } else if (session && profile && location.pathname === AUTH_ROUTES.CREATE_PROFILE) {
      navigateTo(AUTH_ROUTES.PROFILE);
    } else if (session && location.pathname.includes(AUTH_PATH_PREFIX)) {
      navigateTo(AUTH_ROUTES.PROFILE);
    }
  }, [session, profile, isPasswordRecovery, location.pathname]);

  useEffect(() => {
    // supabase will add this hash to the url when a user clicks
    // the first of two emails while updating their email address
    if (
      location.hash.includes(SUPABASE_AUTH.HASH.EMAIL_CHANGE) &&
      hashToastRef.current !== location.hash
    ) {
      hashToastRef.current = location.hash;
      toast.success('Please click the confirmation link sent to the other email', {
        duration: 10000,
      });
    }
    // supabase will add this hash when a user clicks an expired email link
    if (
      location.hash.includes(SUPABASE_AUTH.HASH.LINK_EXPIRED) &&
      hashToastRef.current !== location.hash
    ) {
      hashToastRef.current = location.hash;
      toast.error('Email link is invalid or has expired', { duration: 10000 });
    }
  }, [location.hash]);

  return (
    <>
      <TopNav />

      <div className="max-w-screen-lg mx-auto pt-20">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};
