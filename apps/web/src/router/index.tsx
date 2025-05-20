import { createBrowserRouter } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { Layout } from './Layout';
import { NotFound } from '../pages/NotFound';
import { Home } from '../pages/Home';
import { Profile } from '../pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      // {
      //   path: '/auth/sign-in',
      //   element: <SignInPage />,
      // },
      // {
      //   path: '/auth/sign-up',
      //   element: <SignUpPage />,
      // },
      {
        path: '/',
        element: <AuthRoute />,
        children: [
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
