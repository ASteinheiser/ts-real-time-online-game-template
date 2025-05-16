import { ApolloClient, InMemoryCache } from '@apollo/client';

const GRAPHQL_URL = 'http://localhost:4204/graphql';

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});
