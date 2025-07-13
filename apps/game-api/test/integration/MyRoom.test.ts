import assert from 'assert';
import { ServerError } from '@colyseus/core';
import { type ColyseusTestServer, boot } from '@colyseus/testing';
import type { GoTrueAdminApi } from '@supabase/supabase-js';
import { WS_CODE, WS_EVENT } from '@repo/core-game';
import { makeApp } from '../../src/app.config';
import { ROOM_ERROR } from '../../src/rooms/error';
import {
  DEFAULT_USER_ID,
  TEST_USER_IDS,
  joinTestRoom,
  generateTestJWT,
  createTestPrismaClient,
  setupTestDb,
  cleanupTestDb,
} from './utils';

describe('Colyseus WebSocket Server', () => {
  let server: ColyseusTestServer;
  let prisma: ReturnType<typeof createTestPrismaClient>;
  // currently unused, but required by the app config
  const authClient = {} as GoTrueAdminApi;

  before(async () => {
    prisma = createTestPrismaClient();
    await cleanupTestDb(prisma);
    await setupTestDb(prisma);
    const app = makeApp({ prisma, authClient });
    server = await boot(app);
  });

  after(async () => {
    await server.shutdown();
    await cleanupTestDb(prisma);
  });

  beforeEach(async () => {
    await server.cleanup();
  });

  describe('error handling', () => {
    // todo: case for unhandled exception

    it('should throw an error if a client joins with an invalid token', async () => {
      try {
        await joinTestRoom({ server, token: 'invalid-token' });
        // should never reach this line
        assert.strictEqual(true, false);
      } catch (error) {
        assert.strictEqual((error as ServerError).code, WS_CODE.UNAUTHORIZED);
        assert.strictEqual((error as ServerError).message, ROOM_ERROR.INVALID_TOKEN);
      }
    });

    it('should throw an error if a client joins with an expired token', async () => {
      try {
        await joinTestRoom({ server, token: generateTestJWT({ expiresInMs: 0 }) });
        // should never reach this line
        assert.strictEqual(true, false);
      } catch (error) {
        assert.strictEqual((error as ServerError).code, WS_CODE.UNAUTHORIZED);
        assert.strictEqual((error as ServerError).message, ROOM_ERROR.INVALID_TOKEN);
      }
    });

    it('should throw an error if a client joins without a db user', async () => {
      try {
        // pass a unique userId that does not exist in the seed data found in setupTestDb inside ./utils.ts
        await joinTestRoom({ server, token: generateTestJWT({ userId: 'non-existent-user-id' }) });
        // should never reach this line
        assert.strictEqual(true, false);
      } catch (error) {
        assert.strictEqual((error as ServerError).code, WS_CODE.NOT_FOUND);
        assert.strictEqual((error as ServerError).message, ROOM_ERROR.PROFILE_NOT_FOUND);
      }
    });

    it('should throw an error if a client joins with a token that is already in use', async () => {
      try {
        // the default token generated will have the same userId
        await joinTestRoom({ server, token: generateTestJWT({}) });
        await joinTestRoom({ server, token: generateTestJWT({}) });
        // should never reach this line
        assert.strictEqual(true, false);
      } catch (error) {
        assert.strictEqual((error as ServerError).code, WS_CODE.FORBIDDEN);
        assert.strictEqual((error as ServerError).message, ROOM_ERROR.PLAYER_ALREADY_JOINED);
      }
    });

    it('should kick a client if their token expires', async () => {
      // we need this client otherwise the room will be disposed when the client is kicked
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ userId: TEST_USER_IDS[0] }),
      });
      // should be at least 1 second to account for joining a room and waiting for the next patch
      const expiresInMs = 1000;
      const client = await joinTestRoom({ server, token: generateTestJWT({ expiresInMs }) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextPatch();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1].sessionId, client.sessionId);

      await new Promise((resolve) => setTimeout(resolve, expiresInMs));
      await room.waitForNextPatch();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
    });

    // todo: handle case for onMessage refreshToken bad token

    // todo: handle case for onMessage refreshToken expired token

    // todo: handle case for onMessage refreshToken no player

    // todo: handle case for onMessage refreshToken userId changed
  });

  describe('basic room functionality', () => {
    it('should connect a client to a room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = server.getRoomById(client.roomId);

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);
    });

    it('should allow a client to gracefully leave the room', async () => {
      const client1 = await joinTestRoom({ server, token: generateTestJWT({ userId: TEST_USER_IDS[0] }) });
      const client2 = await joinTestRoom({ server, token: generateTestJWT({ userId: TEST_USER_IDS[1] }) });

      const room = server.getRoomById(client1.roomId);
      await room.waitForNextPatch();
      let { players } = room.state.toJSON();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(!!players[client1.sessionId], true);
      assert.strictEqual(!!players[client2.sessionId], true);
      assert.strictEqual(players[client1.sessionId].userId, TEST_USER_IDS[0]);
      assert.strictEqual(players[client2.sessionId].userId, TEST_USER_IDS[1]);

      await client2.send(WS_EVENT.LEAVE_ROOM);

      await room.waitForNextPatch();
      ({ players } = room.state.toJSON());

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(!!players[client1.sessionId], true);
      assert.strictEqual(!!players[client2.sessionId], false);
      assert.strictEqual(players[client1.sessionId].userId, TEST_USER_IDS[0]);
      assert.strictEqual(players[client2.sessionId], undefined);
    });

    it('should allow a client to refresh their auth token', async () => {
      // should be at least 1 second to account for joining a room and waiting for the next patch
      const expiresInMs = 1000;
      const client = await joinTestRoom({ server, token: generateTestJWT({ expiresInMs }) });

      const room = server.getRoomById(client.roomId);
      await room.waitForNextPatch();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: generateTestJWT({}) });

      await new Promise((resolve) => setTimeout(resolve, expiresInMs));
      await room.waitForNextPatch();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);
    });

    it('should add a player to the room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = server.getRoomById(client.roomId);

      await room.waitForNextPatch();
      const { players } = client.state.toJSON();

      assert.strictEqual(Object.keys(players).length, 1);
      assert.strictEqual(players[client.sessionId].userId, DEFAULT_USER_ID);
      assert.strictEqual(typeof players[client.sessionId].x, 'number');
      assert.strictEqual(typeof players[client.sessionId].y, 'number');
    });

    it('should spawn an enemy in the room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = server.getRoomById(client.roomId);

      await room.waitForNextPatch();
      const { enemies } = client.state.toJSON();

      assert.strictEqual(Object.keys(enemies).length, 1);
      assert.strictEqual(typeof enemies[0].id, 'string');
      assert.strictEqual(typeof enemies[0].x, 'number');
      assert.strictEqual(typeof enemies[0].y, 'number');
    });

    it('should add multiple players to the room', async () => {
      const client1 = await joinTestRoom({ server, token: generateTestJWT({ userId: TEST_USER_IDS[0] }) });
      const client2 = await joinTestRoom({ server, token: generateTestJWT({ userId: TEST_USER_IDS[1] }) });
      const client3 = await joinTestRoom({ server, token: generateTestJWT({ userId: TEST_USER_IDS[2] }) });
      const client4 = await joinTestRoom({ server, token: generateTestJWT({ userId: TEST_USER_IDS[3] }) });

      const room = server.getRoomById(client1.roomId);
      await room.waitForNextPatch();
      const { players } = room.state.toJSON();

      assert.strictEqual(players[client1.sessionId].userId, TEST_USER_IDS[0]);
      assert.strictEqual(players[client2.sessionId].userId, TEST_USER_IDS[1]);
      assert.strictEqual(players[client3.sessionId].userId, TEST_USER_IDS[2]);
      assert.strictEqual(players[client4.sessionId].userId, TEST_USER_IDS[3]);
    });
  });
});
