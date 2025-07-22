import jwt from 'jsonwebtoken';
import type { ColyseusTestServer } from '@colyseus/testing';
import type { GraphQLResponse } from '@apollo/server';
import { WS_ROOM, WS_EVENT } from '@repo/core-game';
import type { GameRoomState } from '../../src/rooms/GameRoom/roomState';
import { PrismaClient } from '../../src/prisma-client';
import type { DecodedToken, User } from '../../src/auth/jwt';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

/** default is 10 seconds (10000ms) */
export const DEFAULT_EXPIRES_IN_MS = 10 * 1000;
interface TestUser {
  id: string;
  userName: string;
  email: string;
}
export const KEEP_ALIVE_USER: TestUser = {
  id: 'keep-alive-user-id',
  userName: 'keep-alive-user-name',
  email: 'keep-alive-user@email.com',
};
export const TEST_USERS: Array<TestUser> = Array(5)
  .fill(null)
  .map((_, i) => ({
    id: `test-user-id-${i + 1}`,
    userName: `test-user-name-${i + 1}`,
    email: `test-user-${i + 1}@email.com`,
  }));

export const makeTestContextUser = (user: TestUser): User => {
  return {
    id: user.id,
    email: user.email,
    expiresAt: Date.now() + DEFAULT_EXPIRES_IN_MS,
  };
};

interface GenerateTestJWTArgs {
  user?: TestUser;
  /** Defaults to 10 seconds (10000ms) */
  expiresInMs?: number;
}

export const generateTestJWT = ({
  user = TEST_USERS[0],
  expiresInMs = DEFAULT_EXPIRES_IN_MS,
}: GenerateTestJWTArgs): string => {
  const payload: DecodedToken = {
    sub: user.id,
    email: user.email,
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
  const client = await server.sdk.joinOrCreate<GameRoomState>(WS_ROOM.GAME_ROOM);

  // register onMessage handler otherwise colyseus throws a warning
  client.onMessage(WS_EVENT.PLAYGROUND_MESSAGE_TYPES, () => {});

  return client;
};

interface ReconnectTestRoomArgs {
  server: ColyseusTestServer;
  reconnectionToken: string;
}
/** reconnect to a room on a test server */
export const reconnectTestRoom = async ({ server, reconnectionToken }: ReconnectTestRoomArgs) => {
  const client = await server.sdk.reconnect(reconnectionToken);

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
        userId: KEEP_ALIVE_USER.id,
        userName: KEEP_ALIVE_USER.userName,
      },
    }),
    ...TEST_USERS.map(({ id, userName }) =>
      prisma.profile.create({
        data: {
          userId: id,
          userName,
        },
      })
    ),
  ]);
};

/** deletes test data from each table */
export const cleanupTestDb = async (prisma: PrismaClient) => {
  await prisma.profile.deleteMany();
};
