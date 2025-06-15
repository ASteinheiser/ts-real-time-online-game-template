import { Outlet } from 'react-router-dom';
import { useForcedAuthFlow, useNotifyOnURLHash } from '@repo/client-auth/router';
import { useStartAtTopOfPage } from '@repo/ui/hooks';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';

export const Layout = () => {
  useForcedAuthFlow();
  useNotifyOnURLHash();
  useStartAtTopOfPage();

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
