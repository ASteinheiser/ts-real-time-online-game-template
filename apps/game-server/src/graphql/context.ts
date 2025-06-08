import { ContextFunction } from '@apollo/server';
import { type GoTrueAdminApi } from '@supabase/supabase-js';
import { BooksRepository } from '../repo/Books';
import { ProfilesRepository } from '../repo/Profiles';
import type { PrismaClient } from '../prisma-client';
import { validateJwt, type User } from '../auth/jwt';

interface CreateContextArgs {
  authHeader?: string;
  authClient: GoTrueAdminApi;
  prisma: PrismaClient;
}

export interface Context {
  user: User | null;
  authClient: GoTrueAdminApi;
  dataSources: {
    booksDb: BooksRepository;
    profilesDb: ProfilesRepository;
  };
}

export const createContext: ContextFunction<[CreateContextArgs], Context> = async ({
  authHeader,
  authClient,
  prisma,
}) => {
  const user = validateJwt(authHeader);

  return {
    user,
    authClient,
    dataSources: {
      booksDb: new BooksRepository(),
      profilesDb: new ProfilesRepository(prisma),
    },
  };
};
