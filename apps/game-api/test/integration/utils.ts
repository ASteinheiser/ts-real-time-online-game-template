import jwt from 'jsonwebtoken';
import { ColyseusTestServer } from '@colyseus/testing';
import type { GraphQLResponse } from '@apollo/server';
import { WS_ROOM, WS_EVENT } from '@repo/core-game';
import { MyRoomState } from '../../src/rooms/schema/MyRoomState';
import type { DecodedToken } from '../../src/auth/jwt';
import type { PrismaClient } from '../../src/prisma-client';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

export const DEFAULT_USER_ID = 'test-user-id';
export const DEFAULT_EMAIL = 'test@example.com';
export const DEFAULT_EXPIRES_IN_MS = 10 * 1000; // 10 seconds

interface GenerateTestJWTArgs {
  userId?: string;
  email?: string;
  expiresInMs?: number;
}

export const generateTestJWT = ({
  userId = DEFAULT_USER_ID,
  email = DEFAULT_EMAIL,
  expiresInMs = DEFAULT_EXPIRES_IN_MS,
}: GenerateTestJWTArgs): string => {
  const payload: DecodedToken = {
    sub: userId,
    email,
    exp: Math.floor(Date.now() / 1000) + expiresInMs,
  };

  return jwt.sign(payload, JWT_SECRET);
};

interface CreateWSClientArgs {
  server: ColyseusTestServer;
  token: string;
}

export const createWSClient = async ({ server, token }: CreateWSClientArgs) => {
  server.sdk.auth.token = token;
  const client = await server.sdk.joinOrCreate<MyRoomState>(WS_ROOM.GAME_ROOM);

  // register onMessage handler otherwise colyseus throws a warning
  client.onMessage(WS_EVENT.PLAYGROUND_MESSAGE_TYPES, () => {});

  return client;
};

export const parseGQLData = <Type>(result: GraphQLResponse<Type>) => {
  return result.body.kind === 'single'
    ? (result.body.singleResult?.data as Type)
    : (result.body.initialResult.data as Type);
};

export const mockPrismaClient = {
  profile: {
    findUnique: (args: { where: { userId: string } }) =>
      Promise.resolve({
        userId: args.where.userId,
        userName: 'test-user',
      }),
  },
} as unknown as PrismaClient;
