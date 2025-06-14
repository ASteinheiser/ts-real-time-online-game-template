import { ProfileForm } from '@repo/client-auth/forms';
import { APP_ROUTES } from '../../router/constants';

export const Profile = () => {
  return (
    <div className="fullscreen-center">
      <ProfileForm logoutRedirectPath={APP_ROUTES.HOME} />
    </div>
  );
};
