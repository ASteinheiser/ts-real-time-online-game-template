import { readFileSync } from 'node:fs';
import { ApolloServer } from '@apollo/server';
import { resolvers } from './graphql/resolvers';

const typeDefs = readFileSync('./graphql/schema.graphql', 'utf8');

export const server = new ApolloServer({
  typeDefs,
  resolvers,
});
