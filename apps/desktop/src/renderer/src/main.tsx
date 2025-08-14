import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@repo/ui';
import { SessionProvider } from '@repo/client-auth/provider';
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/client';
import { router } from './router';
import { SEARCH_PARAMS } from './router/constants';
import { SplashProvider } from './SplashProvider';
import './theme.css';

/** this is required by the content security policy defined in index.html */
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error('VITE_API_URL is not set');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <SplashProvider>
        <SessionProvider healthCheckEnabled isDesktop profilePathOverride={`?${SEARCH_PARAMS.PROFILE}=true`}>
          <RouterProvider router={router} />
        </SessionProvider>
      </SplashProvider>
    </ApolloProvider>

    <Toaster />
  </StrictMode>
);
