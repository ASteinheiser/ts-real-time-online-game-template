import { createBrowserRouter } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { Layout } from './Layout';
import { NotFound } from '../pages/NotFound';
import { Home } from '../pages/Home';
import { Profile } from '../pages/Profile';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ProfileCreate } from '../pages/auth/ProfileCreate';

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
        path: '/auth/login',
        element: <Login />,
      },
      {
        path: '/auth/signup',
        element: <Signup />,
      },
      {
        path: '/',
        element: <AuthRoute />,
        children: [
          {
            path: '/profile',
            element: <Profile />,
          },
          {
            path: '/create-profile',
            element: <ProfileCreate />,
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
