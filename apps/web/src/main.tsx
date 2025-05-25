import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from '@repo/ui';
import { client } from './graphql/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { SessionProvider } from './router/SessionContext';
import './theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </ApolloProvider>

    <Toaster />
  </StrictMode>
);
