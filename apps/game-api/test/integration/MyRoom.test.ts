import assert from 'assert';
import { ColyseusTestServer, boot } from '@colyseus/testing';
import type { GoTrueAdminApi } from '@supabase/supabase-js';
import { makeApp } from '../../src/app.config';
import { createWSClient, generateTestJWT, mockPrismaClient, DEFAULT_USER_ID } from './utils';

describe('Colyseus WebSocket Server', () => {
  let server: ColyseusTestServer;

  const authClient = {} as GoTrueAdminApi;
  const prisma = mockPrismaClient;

  const app = makeApp({ prisma, authClient });

  before(async () => (server = await boot(app)));
  after(async () => server.shutdown());

  beforeEach(async () => await server.cleanup());

  it('should not allow a client to join a room without a valid token', async () => {
    try {
      await createWSClient({ server, token: 'invalid-token' });
    } catch (error) {
      assert.strictEqual(error instanceof Error, true);
    }
  });

  it('should connect a client to a room', async () => {
    const token = generateTestJWT({});
    const client = await createWSClient({ server, token });
    const room = server.getRoomById(client.roomId);

    assert.strictEqual(client.sessionId, room.clients[0].sessionId);
  });

  it('should add a player to the room', async () => {
    const token = generateTestJWT({});
    const client = await createWSClient({ server, token });
    const room = server.getRoomById(client.roomId);

    await room.waitForNextPatch();
    const { players } = client.state.toJSON();

    assert.strictEqual(Object.keys(players).length, 1);
    assert.strictEqual(players[client.sessionId].userId, DEFAULT_USER_ID);
  });

  it('should spawn an enemy in the room', async () => {
    const token = generateTestJWT({});
    const client = await createWSClient({ server, token });
    const room = server.getRoomById(client.roomId);

    await room.waitForNextPatch();
    const { enemies } = client.state.toJSON();

    assert.strictEqual(Object.keys(enemies).length, 1);
    assert.strictEqual(typeof enemies[0].id, 'string');
  });

  it('should add multiple players to the room', async () => {
    const userIds = ['user-1', 'user-2', 'user-3', 'user-4'];

    const client1 = await createWSClient({ server, token: generateTestJWT({ userId: userIds[0] }) });
    const client2 = await createWSClient({ server, token: generateTestJWT({ userId: userIds[1] }) });
    const client3 = await createWSClient({ server, token: generateTestJWT({ userId: userIds[2] }) });
    const client4 = await createWSClient({ server, token: generateTestJWT({ userId: userIds[3] }) });

    const room = server.getRoomById(client1.roomId);
    await room.waitForNextPatch();

    const roomState = room.state.toJSON();

    assert.strictEqual(roomState.players[client1.sessionId].userId, userIds[0]);
    assert.strictEqual(roomState.players[client2.sessionId].userId, userIds[1]);
    assert.strictEqual(roomState.players[client3.sessionId].userId, userIds[2]);
    assert.strictEqual(roomState.players[client4.sessionId].userId, userIds[3]);
  });
});
