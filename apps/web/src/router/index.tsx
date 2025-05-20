import { createBrowserRouter, Outlet } from 'react-router-dom';
import { SessionProvider } from './SessionContext';
import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';
import { AuthRoute } from './AuthRoute';
import { Profile } from '../pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SessionProvider>
        <Outlet />
      </SessionProvider>
    ),
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
