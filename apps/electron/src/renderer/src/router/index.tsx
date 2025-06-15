import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute, AUTH_ROUTES } from '@repo/client-auth/router';
import { Layout } from './Layout';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { NewPassword } from '../pages/auth/NewPassword';
import { ProfileCreate } from '../pages/auth/ProfileCreate';
import { Profile } from '../pages/auth/Profile';
import { Game } from '../pages/Game';
import { APP_ROUTES } from './constants';

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
        element: <Signup />,
      },
      {
        path: AUTH_ROUTES.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: '/',
        element: <PrivateRoute userNotAuthenticated={<Login />} />,
        children: [
          {
            path: AUTH_ROUTES.NEW_PASSWORD,
            element: <NewPassword />,
          },
          {
            path: AUTH_ROUTES.CREATE_PROFILE,
            element: <ProfileCreate />,
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
