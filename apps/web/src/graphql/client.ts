import { ApolloClient, InMemoryCache } from '@apollo/client';

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL;
if (!GRAPHQL_URL) throw new Error('VITE_GRAPHQL_URL is not set');

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});
