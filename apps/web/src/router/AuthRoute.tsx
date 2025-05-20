import { Outlet } from 'react-router-dom';
import { useSession } from './SessionContext';
import { NotFound } from '../pages/NotFound';

export const AuthRoute = () => {
  const { session } = useSession();
  if (!session) {
    return <NotFound />;
  }
  return <Outlet />;
};
