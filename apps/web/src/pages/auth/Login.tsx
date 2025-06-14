import { LoginForm } from '@repo/client-auth/forms';
import { AUTH_ROUTES } from '@repo/client-auth/router';

export const Login = () => {
  return (
    <div className="fullscreen-center">
      <LoginForm loginRedirectPath={AUTH_ROUTES.PROFILE} />
    </div>
  );
};
