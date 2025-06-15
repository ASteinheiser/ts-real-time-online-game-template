import { LoginForm } from '@repo/client-auth/forms';
import { APP_ROUTES } from '../../router/constants';

export const Login = () => {
  return (
    <div className="fullscreen-center">
      <LoginForm loginRedirectPath={APP_ROUTES.GAME} />
    </div>
  );
};
