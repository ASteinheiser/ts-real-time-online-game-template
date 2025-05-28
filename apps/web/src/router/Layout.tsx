import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { useSession } from './SessionContext';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { session, profile, isPasswordRecovery } = useSession();

  useEffect(() => {
    if (session && isPasswordRecovery) {
      if (location.pathname !== '/auth/new-password') navigate('/auth/new-password');
    } else if (session && !profile) {
      if (location.pathname !== '/create-profile') navigate('/create-profile');
    }
  }, [session, profile, isPasswordRecovery, location.pathname]);

  return (
    <>
      <TopNav />

      <div className="max-w-screen-lg mx-auto pt-20">
        <Outlet />
      </div>
    </>
  );
};
