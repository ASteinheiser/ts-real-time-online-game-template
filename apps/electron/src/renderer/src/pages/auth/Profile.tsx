import { ProfileForm } from '@repo/client-auth/forms';
import { AUTH_ROUTES } from '@repo/client-auth/router';

export const Profile = () => {
  return (
    <div className="fullscreen-center">
      <ProfileForm logoutRedirectPath={AUTH_ROUTES.LOGIN} />
    </div>
  );
};
