import assert from 'assert';
import type { ServerError } from '@colyseus/core';
import { type ColyseusTestServer, boot } from '@colyseus/testing';
import type { GoTrueAdminApi } from '@supabase/supabase-js';
import { WS_CODE, WS_EVENT, WS_ROOM, CONNECTION_CHECK_INTERVAL, INACTIVITY_TIMEOUT } from '@repo/core-game';
import { Player } from '../../src/rooms/GameRoom/roomState';
import { makeApp } from '../../src/app.config';
import { ROOM_ERROR } from '../../src/rooms/error';
import {
  KEEP_ALIVE_USER,
  TEST_USERS,
  joinTestRoom,
  generateTestJWT,
  createTestPrismaClient,
  setupTestDb,
  cleanupTestDb,
} from './utils';

describe(`Colyseus WebSocket Server - ${WS_ROOM.GAME_ROOM}`, () => {
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
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await server.cleanup();
  });

  describe('error handling', () => {
    it('should cleanup orphaned players in the case where a client cannot be found', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = server.getRoomById(client.roomId);
      await room.waitForNextSimulationTick();
      let { players } = room.state.toJSON();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);
      assert.strictEqual(Object.keys(players).length, 1);
      assert.strictEqual(!!players[client.sessionId], true);

      const badSessionId = 'bad-session-id';
      room.state.players.set(badSessionId, new Player());

      await room.waitForNextSimulationTick();
      ({ players } = room.state.toJSON());

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);
      assert.strictEqual(Object.keys(players).length, 2);
      assert.strictEqual(!!players[client.sessionId], true);
      assert.strictEqual(!!players[badSessionId], true);

      await new Promise((resolve) => setTimeout(resolve, CONNECTION_CHECK_INTERVAL));

      await room.waitForNextSimulationTick();
      ({ players } = room.state.toJSON());

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);
      assert.strictEqual(Object.keys(players).length, 1);
      assert.strictEqual(!!players[client.sessionId], true);
    });

    it('should kick clients that are inactive for too long', async () => {
      /** We need this client otherwise the room will be disposed when the client is kicked */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: KEEP_ALIVE_USER }),
      });
      const client1 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[0] }) });
      const client2 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[1] }) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextSimulationTick();
      let { players } = room.state.toJSON();

      assert.strictEqual(room.clients.length, 3);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1].sessionId, client1.sessionId);
      assert.strictEqual(room.clients[2].sessionId, client2.sessionId);
      assert.strictEqual(Object.keys(players).length, 3);
      assert.strictEqual(!!players[keepAliveClient.sessionId], true);
      assert.strictEqual(!!players[client1.sessionId], true);
      assert.strictEqual(!!players[client2.sessionId], true);

      room.state.players.get(client1.sessionId).lastActivityTime = Date.now() - INACTIVITY_TIMEOUT;
      room.state.players.get(client2.sessionId).lastActivityTime = Date.now() - INACTIVITY_TIMEOUT;

      await new Promise((resolve) => setTimeout(resolve, CONNECTION_CHECK_INTERVAL));

      await room.waitForNextSimulationTick();
      ({ players } = room.state.toJSON());

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1], undefined);
      assert.strictEqual(room.clients[2], undefined);
      assert.strictEqual(Object.keys(players).length, 1);
      assert.strictEqual(!!players[keepAliveClient.sessionId], true);
      assert.strictEqual(!!players[client1.sessionId], false);
      assert.strictEqual(!!players[client2.sessionId], false);
    });

    it('should kick a client if there is an unhandled exception in fixedTick', async () => {
      /** We need this client otherwise the room will be disposed when the client is kicked */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: KEEP_ALIVE_USER }),
      });
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1].sessionId, client.sessionId);

      room.state.players.get(client.sessionId).inputQueue = null;

      // takes 1-2 ticks to kick the client
      await room.waitForNextSimulationTick();
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1], undefined);
    });

    it('should throw an error if a client joins with an invalid token', async () => {
      try {
        await joinTestRoom({ server, token: 'invalid-token' });

        assert.fail('should have thrown an error');
      } catch (error) {
        assert.strictEqual((error as ServerError).code, WS_CODE.UNAUTHORIZED);
        assert.strictEqual((error as ServerError).message, ROOM_ERROR.INVALID_TOKEN);
      }
    });

    it('should throw an error if a client joins with an expired token', async () => {
      try {
        await joinTestRoom({ server, token: generateTestJWT({ expiresInMs: 0 }) });

        assert.fail('should have thrown an error');
      } catch (error) {
        assert.strictEqual((error as ServerError).code, WS_CODE.UNAUTHORIZED);
        assert.strictEqual((error as ServerError).message, ROOM_ERROR.INVALID_TOKEN);
      }
    });

    it('should throw an error if a client joins without a db user', async () => {
      try {
        // pass a unique userId that does not exist in the seed data found in setupTestDb inside ./utils.ts
        const token = generateTestJWT({ user: { ...TEST_USERS[0], id: 'non-existent-user-id' } });
        await joinTestRoom({ server, token });

        assert.fail('should have thrown an error');
      } catch (error) {
        assert.strictEqual((error as ServerError).code, WS_CODE.NOT_FOUND);
        assert.strictEqual((error as ServerError).message, ROOM_ERROR.PROFILE_NOT_FOUND);
      }
    });

    it('should kick the old client if a new client joins with a token that is already in use', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = server.getRoomById(client.roomId);
      await room.waitForNextSimulationTick();
      let { players } = room.state.toJSON();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);
      assert.strictEqual(Object.keys(players).length, 1);

      const oldPlayerPosition = {
        x: players[client.sessionId].x,
        y: players[client.sessionId].y,
      };
      const newClient = await joinTestRoom({ server, token: generateTestJWT({}) });

      assert.notStrictEqual(client.sessionId, newClient.sessionId);

      const newRoomConnection = server.getRoomById(newClient.roomId);
      await newRoomConnection.waitForNextSimulationTick();
      ({ players } = newRoomConnection.state.toJSON());

      assert.strictEqual(newRoomConnection.clients.length, 1);
      assert.strictEqual(newRoomConnection.clients[0].sessionId, newClient.sessionId);
      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, newClient.sessionId);
      assert.strictEqual(Object.keys(players).length, 1);
      assert.strictEqual(players[client.sessionId], undefined);
      assert.strictEqual(players[newClient.sessionId].x, oldPlayerPosition.x);
      assert.strictEqual(players[newClient.sessionId].y, oldPlayerPosition.y);
    });

    it('should kick a client if their token expires', async () => {
      /** We need this client otherwise the room will be disposed when the client is kicked */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: KEEP_ALIVE_USER }),
      });
      // should be at least 1 second to account for joining a room and waiting for the next patch
      const expiresInMs = 1000;
      const client = await joinTestRoom({ server, token: generateTestJWT({ expiresInMs }) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1].sessionId, client.sessionId);

      await new Promise((resolve) => setTimeout(resolve, CONNECTION_CHECK_INTERVAL));
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
    });

    it('should kick a client if they send player input but there is no player for the session', async () => {
      /** We need this client otherwise the room will be disposed when the client is kicked */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: KEEP_ALIVE_USER }),
      });
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1].sessionId, client.sessionId);

      room.state.players.delete(client.sessionId);

      await client.send(WS_EVENT.PLAYER_INPUT, {
        left: true,
        right: false,
        up: false,
        down: false,
        attack: false,
      });
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1], undefined);
    });

    it('should kick a client if they send an invalid refresh token', async () => {
      /** We need this client otherwise the room will be disposed when the client is kicked */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: KEEP_ALIVE_USER }),
      });
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1].sessionId, client.sessionId);

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: 'invalid-token' });

      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1], undefined);
    });

    it('should kick a client if their refresh token is expired', async () => {
      /** We need this client otherwise the room will be disposed when the client is kicked */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: KEEP_ALIVE_USER }),
      });
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1].sessionId, client.sessionId);

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: generateTestJWT({ expiresInMs: 0 }) });

      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1], undefined);
    });

    it('should kick a client if their refresh token has a different userId', async () => {
      /** We need this client otherwise the room will be disposed when the client is kicked */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: KEEP_ALIVE_USER }),
      });
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1].sessionId, client.sessionId);

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: generateTestJWT({ user: TEST_USERS[1] }) });

      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1], undefined);
    });

    it('should kick a client if they send a refresh token and there is no player for the session', async () => {
      /** We need this client otherwise the room will be disposed when the client is kicked */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: KEEP_ALIVE_USER }),
      });
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1].sessionId, client.sessionId);

      room.state.players.delete(client.sessionId);

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: generateTestJWT({}) });

      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, keepAliveClient.sessionId);
      assert.strictEqual(room.clients[1], undefined);
    });
  });

  describe('basic room functionality', () => {
    it('should connect a client to a room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = server.getRoomById(client.roomId);

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);
    });

    it('should allow a client to gracefully leave the room', async () => {
      /** We need this client otherwise the room will be disposed when the client leaves */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: KEEP_ALIVE_USER }),
      });
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = server.getRoomById(keepAliveClient.roomId);
      await room.waitForNextSimulationTick();
      let { players } = room.state.toJSON();

      assert.strictEqual(room.clients.length, 2);
      assert.strictEqual(!!players[keepAliveClient.sessionId], true);
      assert.strictEqual(!!players[client.sessionId], true);
      assert.strictEqual(players[keepAliveClient.sessionId].userId, KEEP_ALIVE_USER.id);
      assert.strictEqual(players[client.sessionId].userId, TEST_USERS[0].id);

      await client.send(WS_EVENT.LEAVE_ROOM);

      await room.waitForNextSimulationTick();
      ({ players } = room.state.toJSON());

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(!!players[keepAliveClient.sessionId], true);
      assert.strictEqual(!!players[client.sessionId], false);
      assert.strictEqual(players[keepAliveClient.sessionId].userId, KEEP_ALIVE_USER.id);
      assert.strictEqual(players[client.sessionId], undefined);
    });

    it('should allow a client to refresh their auth token', async () => {
      // should be at least 1 second to account for joining a room and waiting for the next patch
      const expiresInMs = 1000;
      const client = await joinTestRoom({ server, token: generateTestJWT({ expiresInMs }) });

      const room = server.getRoomById(client.roomId);
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: generateTestJWT({}) });

      await new Promise((resolve) => setTimeout(resolve, CONNECTION_CHECK_INTERVAL));
      await room.waitForNextSimulationTick();

      assert.strictEqual(room.clients.length, 1);
      assert.strictEqual(room.clients[0].sessionId, client.sessionId);
    });

    it('should add a player to the room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = server.getRoomById(client.roomId);

      await room.waitForNextSimulationTick();
      const { players } = room.state.toJSON();

      assert.strictEqual(Object.keys(players).length, 1);
      assert.strictEqual(players[client.sessionId].userId, TEST_USERS[0].id);
      assert.strictEqual(players[client.sessionId].username, TEST_USERS[0].userName);
      assert.strictEqual(typeof players[client.sessionId].x, 'number');
      assert.strictEqual(typeof players[client.sessionId].y, 'number');
    });

    it('should spawn an enemy in the room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = server.getRoomById(client.roomId);

      await room.waitForNextSimulationTick();
      const { enemies } = room.state.toJSON();

      assert.strictEqual(Object.keys(enemies).length, 1);
      assert.strictEqual(typeof enemies[0].id, 'string');
      assert.strictEqual(typeof enemies[0].x, 'number');
      assert.strictEqual(typeof enemies[0].y, 'number');
    });

    it('should add multiple players to the room', async () => {
      const client1 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[0] }) });
      const client2 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[1] }) });
      const client3 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[2] }) });
      const client4 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[3] }) });

      const room = server.getRoomById(client1.roomId);
      await room.waitForNextSimulationTick();
      const { players } = room.state.toJSON();

      assert.strictEqual(players[client1.sessionId].userId, TEST_USERS[0].id);
      assert.strictEqual(players[client2.sessionId].userId, TEST_USERS[1].id);
      assert.strictEqual(players[client3.sessionId].userId, TEST_USERS[2].id);
      assert.strictEqual(players[client4.sessionId].userId, TEST_USERS[3].id);
    });

    it('should add the maximum number of players to the room, then create a new room when needed', async () => {
      const client1 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[0] }) });
      const client2 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[1] }) });
      const client3 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[2] }) });
      const client4 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[3] }) });
      const client5 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[4] }) });

      const room1 = server.getRoomById(client1.roomId);
      await room1.waitForNextSimulationTick();
      const players1 = room1.state.toJSON().players;

      const room2 = server.getRoomById(client5.roomId);
      await room2.waitForNextSimulationTick();
      const players2 = room2.state.toJSON().players;

      assert.strictEqual(Object.keys(players1).length, 4);
      assert.strictEqual(players1[client1.sessionId].userId, TEST_USERS[0].id);
      assert.strictEqual(players1[client2.sessionId].userId, TEST_USERS[1].id);
      assert.strictEqual(players1[client3.sessionId].userId, TEST_USERS[2].id);
      assert.strictEqual(players1[client4.sessionId].userId, TEST_USERS[3].id);

      assert.strictEqual(Object.keys(players2).length, 1);
      assert.strictEqual(players2[client5.sessionId].userId, TEST_USERS[4].id);
    });
  });
});
