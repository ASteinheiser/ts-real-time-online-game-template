import 'mocha';
import assert from 'assert';
import { ColyseusTestServer, boot } from '@colyseus/testing';
import appConfig from '../src/app.config';
import { MyRoomState } from '../src/rooms/schema/MyRoomState';
import { createClient } from './utils';

describe('testing your Colyseus app', () => {
  let server: ColyseusTestServer;

  before(async () => (server = await boot(appConfig)));
  after(async () => server.shutdown());

  beforeEach(async () => await server.cleanup());

  it('should connect a client to a room', async () => {
    const room = await server.createRoom<MyRoomState>('my_room');

    const client = await createClient({ server, room });

    assert.strictEqual(client.sessionId, room.clients[0].sessionId);
  });

  it('should add a player to the room', async () => {
    const room = await server.createRoom<MyRoomState>('my_room');

    const username = 'custom-username';
    const client = await createClient({ server, room, username });

    await room.waitForNextPatch();
    const { players } = client.state.toJSON();

    assert.strictEqual(Object.keys(players).length, 1);
    assert.strictEqual(players[client.sessionId].username, username);
  });

  it('should spawn an enemy in the room', async () => {
    const room = await server.createRoom<MyRoomState>('my_room');

    const client = await createClient({ server, room });

    await room.waitForNextPatch();
    const { enemies } = client.state.toJSON();

    assert.strictEqual(Object.keys(enemies).length, 1);
    assert.strictEqual(typeof enemies[0].id, 'string');
  });
});
