import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@repo/ui';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';
import { useSession } from './SessionContext';
import { SUPABASE_EMAIL_CHANGE_HASH, SUPABASE_EMAIL_EXPIRED_HASH } from './constants';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { session, profile, isPasswordRecovery } = useSession();

  // ensure the user starts at the top of the page when navigating
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);

  useEffect(() => {
    const navigateTo = (path: string) => {
      if (location.pathname !== path) navigate(path);
    };
    // handle app forced navigation flows (auth, profile creation, etc)
    if (session && isPasswordRecovery) {
      navigateTo('/auth/new-password');
    } else if (session && !isPasswordRecovery && location.pathname === '/auth/new-password') {
      navigateTo('/profile');
    } else if (session && !profile) {
      navigateTo('/create-profile');
    } else if (session && profile && location.pathname === '/create-profile') {
      navigateTo('/profile');
    } else if (session && location.pathname.includes('/auth')) {
      navigateTo('/profile');
    }
  }, [session, profile, isPasswordRecovery, location.pathname]);

  useEffect(() => {
    // supabase will add this hash to the url when a user clicks
    // the first of two emails while updating their email address
    if (location.hash.includes(SUPABASE_EMAIL_CHANGE_HASH)) {
      toast.success('Please click the confirmation link sent to the other email', {
        duration: 10000,
      });
    }
    // supabase will add this hash when a user clicks an expired email link
    if (location.hash.includes(SUPABASE_EMAIL_EXPIRED_HASH)) {
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
