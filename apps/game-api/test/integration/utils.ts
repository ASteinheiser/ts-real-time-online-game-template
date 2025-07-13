import jwt from 'jsonwebtoken';
import { ColyseusTestServer } from '@colyseus/testing';
import type { GraphQLResponse } from '@apollo/server';
import { WS_ROOM, WS_EVENT } from '@repo/core-game';
import { MyRoomState } from '../../src/rooms/schema/MyRoomState';
import { PrismaClient } from '../../src/prisma-client';
import type { DecodedToken } from '../../src/auth/jwt';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

export const DEFAULT_USER_ID = 'test-user-id';
export const DEFAULT_EMAIL = 'test@example.com';
export const DEFAULT_EXPIRES_IN_MS = 10 * 1000; // 10 seconds
export const TEST_USER_IDS = Array(5)
  .fill(null)
  .map((_, i) => `test-user-id-${i + 1}`);

interface GenerateTestJWTArgs {
  userId?: string;
  email?: string;
  /** Defaults to 10 seconds (10000ms) */
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
    exp: Math.floor((Date.now() + expiresInMs) / 1000),
  };

  return jwt.sign(payload, JWT_SECRET);
};

interface JoinTestRoomArgs {
  server: ColyseusTestServer;
  token: string;
}

/** join or create a room on a test server */
export const joinTestRoom = async ({ server, token }: JoinTestRoomArgs) => {
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

/** create a prisma client connected to the local test DB */
export const createTestPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: { url: DATABASE_URL },
    },
  });
};

/** seeds data into the local test DB */
export const setupTestDb = async (prisma: PrismaClient) => {
  await Promise.all([
    prisma.profile.create({
      data: {
        userId: DEFAULT_USER_ID,
        userName: `${DEFAULT_USER_ID}-user-name`,
      },
    }),
    ...TEST_USER_IDS.map((userId) =>
      prisma.profile.create({
        data: {
          userId,
          userName: `${userId}-user-name`,
        },
      })
    ),
  ]);
};

/** deletes test data from each table then disconnects the client */
export const cleanupTestDb = async (prisma: PrismaClient) => {
  await prisma.profile.deleteMany();

  await prisma.$disconnect();
};
