import { ProfileForm } from '@repo/client-auth/forms';
import { APP_ROUTES } from '../../router/constants';

export const Profile = () => {
  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <ProfileForm logoutRedirectPath={APP_ROUTES.HOME} />
    </div>
  );
};
