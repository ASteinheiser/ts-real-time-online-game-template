import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

export interface User {
  id: string;
  email: string;
}

interface DecodedToken {
  sub: string;
  email: string;
}

export const validateJwt = (authHeader?: string): User | null => {
  if (!authHeader) return null;

  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET) as DecodedToken;

    if (!decoded.sub || !decoded.email) {
      throw new Error('Invalid token');
    }

    return mapDecodedTokenToUser(decoded);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const mapDecodedTokenToUser = (token: DecodedToken): User => {
  return {
    id: token.sub,
    email: token.email,
  };
};
