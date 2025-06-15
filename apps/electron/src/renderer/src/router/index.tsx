import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute, AUTH_ROUTES } from '@repo/client-auth/router';
import {
  ForgotPasswordForm,
  LoginForm,
  NewPasswordForm,
  ProfileCreateForm,
  ProfileForm,
  SignupForm,
} from '@repo/client-auth/forms';
import { Layout } from './Layout';
import { Game } from '../pages/Game';
import { APP_ROUTES } from './constants';

const Login = () => <LoginForm loginRedirectPath={APP_ROUTES.GAME} />;
const Profile = () => <ProfileForm logoutRedirectPath={AUTH_ROUTES.LOGIN} />;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: AUTH_ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: AUTH_ROUTES.SIGNUP,
        element: <SignupForm />,
      },
      {
        path: AUTH_ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordForm />,
      },
      {
        path: '/',
        element: <PrivateRoute userNotAuthenticated={<Login />} />,
        children: [
          {
            path: AUTH_ROUTES.NEW_PASSWORD,
            element: <NewPasswordForm />,
          },
          {
            path: AUTH_ROUTES.CREATE_PROFILE,
            element: <ProfileCreateForm />,
          },
          {
            path: AUTH_ROUTES.PROFILE,
            element: <Profile />,
          },
          {
            path: APP_ROUTES.GAME,
            element: <Game />,
          },
        ],
      },
      {
        path: '*',
        element: <Login />,
      },
    ],
  },
]);
