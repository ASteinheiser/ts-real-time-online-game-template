import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { useSession } from './SessionContext';

export const Layout = () => {
  const navigate = useNavigate();

  const { session, profile } = useSession();

  useEffect(() => {
    if (session && !profile) {
      navigate('/create-profile');
    }
  }, [session, profile]);

  return (
    <>
      <TopNav />

      <div className="max-w-screen-lg mx-auto">
        <Outlet />
      </div>
    </>
  );
};
