import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { resolvers } from './graphql/resolvers';
import { Context } from './context';

const typeDefs = readFileSync(path.join(import.meta.dirname, 'graphql/schema.graphql'), 'utf8');

export const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});
