import { ContextFunction } from '@apollo/server';
import jwt from 'jsonwebtoken';
import { BooksRepository } from '../repo/Books';
import { ProfilesRepository } from '../repo/Profiles';
import type { PrismaClient } from '../prisma-client';

interface User {
  id: string;
  email: string;
}

interface DecodedToken {
  sub: string;
  email: string;
}

interface CreateContextArgs {
  prisma: PrismaClient;
  authHeader?: string;
}

export interface Context {
  dataSources: {
    booksDb: BooksRepository;
    profilesDb: ProfilesRepository;
  };
  user: User | null;
}

export const createContext: ContextFunction<[CreateContextArgs], Context> = async ({
  prisma,
  authHeader,
}) => {
  let user: User | null = null;
  if (authHeader) {
    try {
      const decoded = jwt.verify(authHeader, process.env.JWT_SECRET) as DecodedToken;
      if (!decoded.sub || !decoded.email) {
        throw new Error('Invalid token');
      }
      user = mapDecodedTokenToUser(decoded);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    user,
    dataSources: {
      booksDb: new BooksRepository(),
      profilesDb: new ProfilesRepository(prisma),
    },
  };
};

const mapDecodedTokenToUser = (token: DecodedToken) => {
  return {
    id: token.sub,
    email: token.email,
  };
};
