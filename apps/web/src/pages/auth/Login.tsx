import { LoginForm } from '@repo/client-auth/forms';
import { AUTH_ROUTES } from '@repo/client-auth/router';

export const Login = () => {
  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <LoginForm loginRedirectPath={AUTH_ROUTES.PROFILE} />
    </div>
  );
};
