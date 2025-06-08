import { Resolvers } from './generated-types';
import type { Context } from './context';

export const resolvers: Resolvers<Context> = {
  Query: {
    books: async (_, __, { dataSources }) => {
      return dataSources.booksDb.getBooks();
    },
    profile: async (_, __, { dataSources, user }) => {
      return dataSources.profilesDb.getProfileByUserId(user.id);
    },
    userExists: async (_, { userName }, { dataSources }) => {
      const profile = await dataSources.profilesDb.getProfileByUserName(userName);
      return Boolean(profile);
    },
  },
  Mutation: {
    createProfile: async (_, { userName }, { dataSources, user }) => {
      return dataSources.profilesDb.createProfile({
        userId: user.id,
        userName,
      });
    },
    updateProfile: async (_, { userName }, { dataSources, user }) => {
      return dataSources.profilesDb.updateProfile({
        userId: user.id,
        userName,
      });
    },
    deleteProfile: async (_, __, { authClient, dataSources, user }) => {
      try {
        await dataSources.profilesDb.deleteProfile(user.id);
        await authClient.deleteUser(user.id);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};
