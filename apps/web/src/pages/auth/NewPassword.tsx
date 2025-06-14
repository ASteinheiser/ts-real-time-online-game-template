import { NewPasswordForm } from '@repo/client-auth/forms';

export const NewPassword = () => {
  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <NewPasswordForm />
    </div>
  );
};
