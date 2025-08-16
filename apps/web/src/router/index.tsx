import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute, AUTH_ROUTES } from '@repo/client-auth/router';
import {
  LoginForm,
  SignupForm,
  ForgotPasswordForm,
  NewPasswordForm,
  ProfileCreateForm,
  ProfileForm,
} from '@repo/client-auth/forms';
import { Layout } from './Layout';
import { NotFound } from '../pages/NotFound';
import { Home } from '../pages/Home';
import { DevLog } from '../pages/DevLog';
import { Download } from '../pages/Download';
import { AuthRedirect } from '../pages/AuthRedirect';
import { APP_ROUTES } from './constants';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: APP_ROUTES.HOME,
        element: <Home />,
      },
      {
        path: APP_ROUTES.DEV_LOG,
        element: <DevLog />,
      },
      {
        path: APP_ROUTES.DOWNLOAD,
        element: <Download />,
      },
      {
        path: AUTH_ROUTES.REDIRECT,
        element: <AuthRedirect />,
      },
      {
        path: AUTH_ROUTES.LOGIN,
        element: <LoginForm loginRedirectPath={AUTH_ROUTES.PROFILE} />,
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
        element: <PrivateRoute userNotAuthenticated={<NotFound />} />,
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
            element: <ProfileForm logoutRedirectPath={APP_ROUTES.HOME} />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
