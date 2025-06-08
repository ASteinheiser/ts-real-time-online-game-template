import { ContextFunction } from '@apollo/server';
import { BooksRepository } from '../repo/Books';
import { ProfilesRepository } from '../repo/Profiles';
import type { PrismaClient } from '../prisma-client';
import { validateJwt, type User } from '../auth/jwt';

interface CreateContextArgs {
  prisma: PrismaClient;
  authHeader?: string;
}

export interface Context {
  user: User | null;
  dataSources: {
    booksDb: BooksRepository;
    profilesDb: ProfilesRepository;
  };
}

export const createContext: ContextFunction<[CreateContextArgs], Context> = async ({
  prisma,
  authHeader,
}) => {
  const user = validateJwt(authHeader);

  return {
    user,
    dataSources: {
      booksDb: new BooksRepository(),
      profilesDb: new ProfilesRepository(prisma),
    },
  };
};
