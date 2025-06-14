import { SignupForm } from '@repo/client-auth/forms';

export const Signup = () => {
  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <SignupForm />
    </div>
  );
};
