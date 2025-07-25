import assert from 'assert';
import type { ServerError } from '@colyseus/core';
import { type ColyseusTestServer, boot } from '@colyseus/testing';
import type { GoTrueAdminApi } from '@supabase/supabase-js';
import { WS_CODE, WS_EVENT, WS_ROOM, INACTIVITY_TIMEOUT, PLAYER_MOVE_SPEED } from '@repo/core-game';
import type { GameRoom } from '../../src/rooms/GameRoom';
import { Player } from '../../src/rooms/GameRoom/roomState';
import { makeApp } from '../../src/app.config';
import { ROOM_ERROR } from '../../src/rooms/error';
import {
  TEST_USERS,
  joinTestRoom,
  reconnectTestRoom,
  generateTestJWT,
  createTestPrismaClient,
  setupTestDb,
  cleanupTestDb,
} from './utils';

/** A shorter interval than the default to speed up tests (in ms) */
const TEST_CONNECTION_CHECK_INTERVAL = 100;

describe(`Colyseus WebSocket Server - ${WS_ROOM.GAME_ROOM}`, () => {
  let server: ColyseusTestServer;
  let prisma: ReturnType<typeof createTestPrismaClient>;
  // currently unused, but required by the app config
  const authClient = {} as GoTrueAdminApi;

  before(async () => {
    prisma = createTestPrismaClient();
    await cleanupTestDb(prisma);
    await setupTestDb(prisma);
    const app = makeApp({
      prisma,
      authClient,
      connectionCheckInterval: TEST_CONNECTION_CHECK_INTERVAL,
    });
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

  const getRoom = (roomId: string) => server.getRoomById(roomId) as GameRoom;

  describe('room onJoin error handling', () => {
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
  });

  describe('basic room functionality', () => {
    it('should connect a player to a room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });
    });

    it('should allow a client to gracefully leave the room', async () => {
      /** We need this client otherwise the room will be disposed when the client leaves */
      const keepAliveClient = await joinTestRoom({
        server,
        token: generateTestJWT({ user: TEST_USERS[1] }),
      });
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(keepAliveClient.roomId);

      assertBasicPlayerState({ room, clientIds: [keepAliveClient.sessionId, client.sessionId] });

      await client.leave(true);
      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [keepAliveClient.sessionId] });
    });

    it('should return WS_CODE.SUCCESS when a client leaves the room via the LEAVE_ROOM event', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);

      const leaveCodePromise = new Promise((resolve) => {
        client.onLeave((code) => resolve(code));
      });

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      await client.send(WS_EVENT.LEAVE_ROOM);
      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [] });
      assert.strictEqual(await leaveCodePromise, WS_CODE.SUCCESS);
    });

    it('should allow a client to reconnect to a room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const reconnectionToken = client.reconnectionToken;

      const room = getRoom(client.roomId);
      room.state.players.get(client.sessionId).attackCount = 100;
      room.state.players.get(client.sessionId).killCount = 50;
      // get a snapshot of the player state
      const oldPlayer = room.state.toJSON().players[client.sessionId];

      assert.strictEqual(oldPlayer.attackCount, 100);
      assert.strictEqual(oldPlayer.killCount, 50);
      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      await client.leave(false);
      await room.waitForNextSimulationTick();

      assertExtraPlayerState({ room, clientIds: [], extraPlayerIds: [client.sessionId] });

      const newClient = await reconnectTestRoom({ server, reconnectionToken });

      assert.strictEqual(newClient.sessionId, client.sessionId);

      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [newClient.sessionId] });
      assertPlayerFieldsState({ room, playerId: newClient.sessionId, expectedPlayer: oldPlayer });
    });

    it('should kick the client if they fail to reconnect in time', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });

      const room = getRoom(client.roomId);
      room.reconnectionTimeout = 0;

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      await client.leave(false);
      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [] });
    });

    it('should kick the old client forcefully and take over the player if a new client joins with the same userId', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);

      const oldPlayer = room.state.players.get(client.sessionId);
      oldPlayer.attackCount = 100;
      oldPlayer.killCount = 50;

      assert.strictEqual(oldPlayer.attackCount, 100);
      assert.strictEqual(oldPlayer.killCount, 50);
      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      const newClient = await joinTestRoom({ server, token: generateTestJWT({}) });

      assert.notStrictEqual(newClient.sessionId, client.sessionId);
      assert.strictEqual(room.forcedDisconnects.has(client.sessionId), true);

      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [newClient.sessionId] });
      assertPlayerFieldsState({ room, playerId: newClient.sessionId, expectedPlayer: oldPlayer });
    });

    it('should add the maximum number of players to the room, then create a new room when needed', async () => {
      const client1 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[0] }) });
      const client2 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[1] }) });
      const client3 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[2] }) });
      const client4 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[3] }) });
      const client5 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[4] }) });

      const room1 = getRoom(client1.roomId);
      const room2 = getRoom(client5.roomId);

      const playersState1 = room1.state.players;
      const playersState2 = room2.state.players;

      assertBasicPlayerState({
        room: room1,
        clientIds: [client1.sessionId, client2.sessionId, client3.sessionId, client4.sessionId],
      });
      assertBasicPlayerState({ room: room2, clientIds: [client5.sessionId] });

      assert.strictEqual(playersState1.get(client1.sessionId).userId, TEST_USERS[0].id);
      assert.strictEqual(playersState1.get(client2.sessionId).userId, TEST_USERS[1].id);
      assert.strictEqual(playersState1.get(client3.sessionId).userId, TEST_USERS[2].id);
      assert.strictEqual(playersState1.get(client4.sessionId).userId, TEST_USERS[3].id);

      assert.strictEqual(playersState2.get(client5.sessionId).userId, TEST_USERS[4].id);
    });
  });

  describe('basic game logic', () => {
    it('should spawn an enemy in the room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);

      await room.waitForNextSimulationTick();
      // get a snapshot of the enemy state
      const { enemies } = room.state.toJSON();

      assert.strictEqual(Object.keys(enemies).length, 1);
      assert.strictEqual(typeof enemies[0].id, 'string');
      assert.strictEqual(typeof enemies[0].x, 'number');
      assert.strictEqual(typeof enemies[0].y, 'number');
    });

    it('should allow a player to move in the room', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);

      room.state.players.get(client.sessionId).attackCount = 100;
      room.state.players.get(client.sessionId).killCount = 50;
      // get a snapshot of the player state
      const oldPlayer = room.state.toJSON().players[client.sessionId];

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });
      assert.strictEqual(oldPlayer.userId, TEST_USERS[0].id);
      assert.strictEqual(oldPlayer.username, TEST_USERS[0].userName);
      assert.strictEqual(typeof oldPlayer.x, 'number');
      assert.strictEqual(typeof oldPlayer.y, 'number');
      assert.strictEqual(oldPlayer.attackCount, 100);
      assert.strictEqual(oldPlayer.killCount, 50);

      await client.send(WS_EVENT.PLAYER_INPUT, {
        left: false,
        right: true,
        up: false,
        down: true,
        attack: false,
      });
      // ensure the input is processed
      await waitForConnectionCheck();

      assertPlayerFieldsState({
        room,
        playerId: client.sessionId,
        // @ts-expect-error - needed to test the player fields state
        expectedPlayer: {
          ...oldPlayer,
          x: oldPlayer.x + PLAYER_MOVE_SPEED,
          y: oldPlayer.y + PLAYER_MOVE_SPEED,
        },
      });
    });

    it('should kick a client if there is an unhandled exception in fixedTick', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);
      room.reconnectionTimeout = 0;

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      room.state.players.get(client.sessionId).inputQueue = null;
      // this takes some time to handle the exception
      await waitForConnectionCheck();

      assertBasicPlayerState({ room, clientIds: [] });
    });

    it('should kick a client if they send player input but there is no player for the session', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);
      room.reconnectionTimeout = 0;

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      room.state.players.delete(client.sessionId);
      await client.send(WS_EVENT.PLAYER_INPUT, {
        left: true,
        right: false,
        up: false,
        down: false,
        attack: false,
      });
      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [] });
    });
  });

  describe('refreshToken behavior', () => {
    it('should allow a client to refresh their auth token', async () => {
      // should be at least 1 second to account for joining a room and waiting for the next patch
      const expiresInMs = 1000;
      const client = await joinTestRoom({ server, token: generateTestJWT({ expiresInMs }) });
      const room = getRoom(client.roomId);

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: generateTestJWT({}) });
      await new Promise((resolve) => setTimeout(resolve, expiresInMs + TEST_CONNECTION_CHECK_INTERVAL));

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });
    });

    it('should kick a client if they send an invalid refresh token', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);
      room.reconnectionTimeout = 0;

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: 'invalid-token' });
      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [] });
    });

    it('should kick a client if their refresh token is expired', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);
      room.reconnectionTimeout = 0;

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: generateTestJWT({ expiresInMs: 0 }) });
      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [] });
    });

    it('should kick a client if their refresh token has a different userId', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);
      room.reconnectionTimeout = 0;

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      await client.send(WS_EVENT.REFRESH_TOKEN, { token: generateTestJWT({ user: TEST_USERS[1] }) });
      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [] });
    });

    it('should kick a client if they send a refresh token and there is no player for the session', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);
      room.reconnectionTimeout = 0;

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      room.state.players.delete(client.sessionId);
      await client.send(WS_EVENT.REFRESH_TOKEN, { token: generateTestJWT({}) });
      await room.waitForNextSimulationTick();

      assertBasicPlayerState({ room, clientIds: [] });
    });
  });

  describe('checkPlayerConnection behavior', () => {
    it('should cleanup orphaned players in the case where a client cannot be found', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      const badSessionId = 'bad-session-id';
      room.state.players.set(badSessionId, new Player());
      await room.waitForNextSimulationTick();

      assertExtraPlayerState({ room, clientIds: [client.sessionId], extraPlayerIds: [badSessionId] });

      await waitForConnectionCheck();

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });
    });

    it('should wait to cleanup orphaned players if expecting a reconnection', async () => {
      const client = await joinTestRoom({ server, token: generateTestJWT({}) });
      const room = getRoom(client.roomId);

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      const badSessionId = 'bad-session-id';
      room.expectingReconnections.add(badSessionId);
      room.state.players.set(badSessionId, new Player());
      await room.waitForNextSimulationTick();

      assertExtraPlayerState({ room, clientIds: [client.sessionId], extraPlayerIds: [badSessionId] });

      await waitForConnectionCheck();

      assertExtraPlayerState({ room, clientIds: [client.sessionId], extraPlayerIds: [badSessionId] });

      room.expectingReconnections.delete(badSessionId);
      await waitForConnectionCheck();

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });
    });

    it('should kick a client if their token expires', async () => {
      // should be at ~1s to account for joining a room and waiting for the next patch
      const expiresInMs = 1000;
      const client = await joinTestRoom({ server, token: generateTestJWT({ expiresInMs }) });

      const room = getRoom(client.roomId);
      room.reconnectionTimeout = 0;

      assertBasicPlayerState({ room, clientIds: [client.sessionId] });

      await new Promise((resolve) => setTimeout(resolve, expiresInMs + TEST_CONNECTION_CHECK_INTERVAL));

      assertBasicPlayerState({ room, clientIds: [] });
    });

    it('should kick clients that are inactive for too long', async () => {
      const client1 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[0] }) });
      const client2 = await joinTestRoom({ server, token: generateTestJWT({ user: TEST_USERS[1] }) });

      const room = getRoom(client1.roomId);
      room.reconnectionTimeout = 0;

      assertBasicPlayerState({
        room,
        clientIds: [client1.sessionId, client2.sessionId],
      });

      room.state.players.get(client1.sessionId).lastActivityTime = Date.now() - INACTIVITY_TIMEOUT;
      room.state.players.get(client2.sessionId).lastActivityTime = Date.now() - INACTIVITY_TIMEOUT;
      await waitForConnectionCheck();

      assertBasicPlayerState({ room, clientIds: [] });
    });
  });
});

// --- Helpers ---

const waitForConnectionCheck = async () =>
  new Promise((resolve) => setTimeout(resolve, TEST_CONNECTION_CHECK_INTERVAL));

interface AssertBasicPlayerStateArgs {
  room: GameRoom;
  clientIds: string[];
}
/** Asserts that the room has the same number of clients and players */
const assertBasicPlayerState = ({ room, clientIds }: AssertBasicPlayerStateArgs) => {
  assert.strictEqual(room.clients.length, clientIds.length);
  assert.strictEqual(room.state.players.size, clientIds.length);

  clientIds.forEach((clientId, index) => {
    assert.strictEqual(room.clients[index].sessionId, clientId);
    assert.strictEqual(!!room.state.players.get(clientId), true);
  });
};

interface AssertExtraPlayerStateArgs {
  room: GameRoom;
  clientIds: string[];
  extraPlayerIds: string[];
}
/** Asserts that the room has additional players with no client attached */
const assertExtraPlayerState = ({ room, clientIds, extraPlayerIds }: AssertExtraPlayerStateArgs) => {
  assert.strictEqual(room.clients.length, clientIds.length);
  assert.strictEqual(room.state.players.size, clientIds.length + extraPlayerIds.length);

  clientIds.forEach((clientId, index) => {
    assert.strictEqual(room.clients[index].sessionId, clientId);
    assert.strictEqual(!!room.state.players.get(clientId), true);
  });

  extraPlayerIds.forEach((extraPlayerId) => {
    assert.strictEqual(!!room.state.players.get(extraPlayerId), true);
  });
};

interface AssertPlayerFieldsStateArgs {
  room: GameRoom;
  playerId: string;
  expectedPlayer: Player;
}
/** Asserts that the player has the correct fields */
const assertPlayerFieldsState = ({ room, playerId, expectedPlayer }: AssertPlayerFieldsStateArgs) => {
  const actualPlayer = room.state.players.get(playerId);

  assert.strictEqual(actualPlayer.x, expectedPlayer.x);
  assert.strictEqual(actualPlayer.y, expectedPlayer.y);
  assert.strictEqual(actualPlayer.userId, expectedPlayer.userId);
  assert.strictEqual(actualPlayer.username, expectedPlayer.username);
  assert.strictEqual(actualPlayer.attackCount, expectedPlayer.attackCount);
  assert.strictEqual(actualPlayer.killCount, expectedPlayer.killCount);
};
