import { Resolvers } from './generated-types';
import type { Context } from './context';

export const resolvers: Resolvers<Context> = {
  Query: {
    books: async (_, __, { dataSources }) => {
      return dataSources.booksDb.getBooks();
    },
    profile: async (_, __, { dataSources }) => {
      return dataSources.profilesDb.getProfileByUserName('test');
    },
  },
};
