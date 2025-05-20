import { Outlet } from 'react-router-dom';
import { TopNav } from '../components/TopNav';

export const Layout = () => {
  return (
    <>
      <TopNav />
      <Outlet />
    </>
  );
};
