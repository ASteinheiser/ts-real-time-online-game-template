import jwt from 'jsonwebtoken';
import { logger } from '../logger';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

export interface User {
  id: string;
  email: string;
  /** Token expiration timestamp in milliseconds */
  expiresAt: number;
}

export interface DecodedToken {
  sub: string;
  email: string;
  /** Unix timestamp (seconds) - comes from supabase */
  exp: number;
}

export const validateJwt = (authHeader?: string): User | null => {
  if (!authHeader) return null;

  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET) as DecodedToken;

    if (!decoded?.sub || !decoded?.email || !decoded?.exp) {
      throw new Error('Invalid token');
    }

    return mapDecodedTokenToUser(decoded);
  } catch (error) {
    const message = (error as Error)?.message ?? 'unknown jwt error occurred';
    logger.info({ message });
    return null;
  }
};

const mapDecodedTokenToUser = (token: DecodedToken): User => {
  return {
    id: token.sub,
    email: token.email,
    /** Convert Unix timestamp (seconds) to milliseconds */
    expiresAt: token.exp * 1000,
  };
};
