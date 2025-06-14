import { Outlet } from 'react-router-dom';
import { useSession } from '../provider/SessionContext';

interface PrivateRouteProps {
  userNotAuthenticated: React.ReactNode;
}

export const PrivateRoute = ({ userNotAuthenticated }: PrivateRouteProps) => {
  const { session } = useSession();

  if (!session) return userNotAuthenticated;

  return <Outlet />;
};
