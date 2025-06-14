import { ForgotPasswordForm } from '@repo/client-auth/forms';

export const ForgotPassword = () => {
  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <ForgotPasswordForm />
    </div>
  );
};
