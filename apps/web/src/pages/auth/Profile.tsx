import { ProfileForm } from '@repo/client-auth/forms';

export const Profile = () => {
  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <ProfileForm logoutRedirectPath="/" />
    </div>
  );
};
