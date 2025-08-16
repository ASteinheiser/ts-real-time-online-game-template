import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute, AUTH_ROUTES } from '@repo/client-auth/router';
import { ForgotPasswordForm, LoginForm, ProfileCreateForm, SignupForm } from '@repo/client-auth/forms';
import { Layout } from './Layout';
import { NotFound } from '../pages/NotFound';
import { Game } from '../pages/Game';
import { APP_ROUTES } from './constants';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: AUTH_ROUTES.LOGIN,
        element: <LoginForm loginRedirectPath={APP_ROUTES.GAME} />,
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
            path: AUTH_ROUTES.CREATE_PROFILE,
            element: <ProfileCreateForm />,
          },
          {
            path: APP_ROUTES.GAME,
            element: <Game />,
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
