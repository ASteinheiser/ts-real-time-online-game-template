import { LoginForm } from '@repo/client-auth/forms';

export const Login = () => {
  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <LoginForm />
    </div>
  );
};
