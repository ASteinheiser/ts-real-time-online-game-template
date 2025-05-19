import { ContextFunction } from '@apollo/server';
import { BooksRepository } from '../repo/Books';
import { ProfilesRepository } from '../repo/Profiles';
import type { PrismaClient } from '../prisma-client';

interface CreateContextArgs {
  prisma: PrismaClient;
}

export interface Context {
  dataSources: {
    booksDb: BooksRepository;
    profilesDb: ProfilesRepository;
  };
}

export const createContext: ContextFunction<[CreateContextArgs], Context> = async ({ prisma }) => {
  return {
    dataSources: {
      booksDb: new BooksRepository(),
      profilesDb: new ProfilesRepository(prisma),
    },
  };
};
