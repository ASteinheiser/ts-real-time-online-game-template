import { ProfileCreateForm } from '@repo/client-auth/forms';

export const ProfileCreate = () => {
  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <ProfileCreateForm />
    </div>
  );
};
