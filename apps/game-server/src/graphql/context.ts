import { ContextFunction } from '@apollo/server';
import { BooksRepository } from '../repo/Books';
import { UsersRepository } from '../repo/Users';
import type { PrismaClient } from '../prisma-client';

interface CreateContextArgs {
  prisma: PrismaClient;
}

export interface Context {
  dataSources: {
    booksDb: BooksRepository;
    usersDb: UsersRepository;
  };
}

export const createContext: ContextFunction<[CreateContextArgs], Context> = async ({ prisma }) => {
  return {
    dataSources: {
      booksDb: new BooksRepository(),
      usersDb: new UsersRepository(prisma),
    },
  };
};
