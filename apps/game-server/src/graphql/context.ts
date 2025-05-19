import { ContextFunction } from '@apollo/server';
import { BooksRepository } from '../repo/Books';
import { ProfilesRepository } from '../repo/Profiles';
import type { PrismaClient } from '../prisma-client';

interface User {
  id: string;
}

interface CreateContextArgs {
  prisma: PrismaClient;
  user: User;
}

export interface Context {
  dataSources: {
    booksDb: BooksRepository;
    profilesDb: ProfilesRepository;
  };
  user: User;
}

export const createContext: ContextFunction<[CreateContextArgs], Context> = async ({
  prisma,
  user,
}) => {
  return {
    dataSources: {
      booksDb: new BooksRepository(),
      profilesDb: new ProfilesRepository(prisma),
    },
    user,
  };
};
