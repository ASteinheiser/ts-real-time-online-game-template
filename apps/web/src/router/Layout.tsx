import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { useSession } from './SessionContext';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { session, profile, isPasswordRecovery } = useSession();

  useEffect(() => {
    const navigateTo = (path: string) => {
      if (location.pathname !== path) navigate(path);
    };

    if (session && isPasswordRecovery) {
      navigateTo('/auth/new-password');
    } else if (session && !profile) {
      navigateTo('/create-profile');
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
