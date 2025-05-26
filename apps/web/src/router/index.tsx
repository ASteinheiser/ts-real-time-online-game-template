import { createBrowserRouter } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { Layout } from './Layout';
import { NotFound } from '../pages/NotFound';
import { Home } from '../pages/Home';
import { DevLog } from '../pages/DevLog';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { NewPassword } from '../pages/auth/NewPassword';
import { ProfileCreate } from '../pages/auth/ProfileCreate';
import { Profile } from '../pages/auth/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/dev-log',
        element: <DevLog />,
      },
      {
        path: '/auth/login',
        element: <Login />,
      },
      {
        path: '/auth/signup',
        element: <Signup />,
      },
      {
        path: '/auth/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/auth/new-password',
        element: <NewPassword />,
      },
      {
        path: '/',
        element: <AuthRoute />,
        children: [
          {
            path: '/auth/profile',
            element: <ProfileCreate />,
          },
          {
            path: '/profile',
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
