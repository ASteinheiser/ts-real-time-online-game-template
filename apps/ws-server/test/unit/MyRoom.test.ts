import assert from 'assert';
import { ColyseusTestServer, boot } from '@colyseus/testing';
import appConfig from '../../src/app.config';
import { MyRoomState } from '../../src/rooms/schema/MyRoomState';
import { createClient } from '../utils';

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

  it('should add multiple players to the room', async () => {
    const room = await server.createRoom<MyRoomState>('my_room');

    const username1 = 'custom-username-1';
    const username2 = 'custom-username-2';
    const username3 = 'custom-username-3';
    const username4 = 'custom-username-4';

    const [client1, client2, client3, client4] = await Promise.all([
      createClient({ server, room, username: username1 }),
      createClient({ server, room, username: username2 }),
      createClient({ server, room, username: username3 }),
      createClient({ server, room, username: username4 }),
    ]);

    await room.waitForNextPatch();
    const client1State = client1.state.toJSON();
    const client2State = client2.state.toJSON();
    const client3State = client3.state.toJSON();
    const client4State = client4.state.toJSON();

    assert.strictEqual(Object.keys(client1State.players).length, 4);
    assert.strictEqual(Object.keys(client2State.players).length, 4);
    assert.strictEqual(Object.keys(client3State.players).length, 4);
    assert.strictEqual(Object.keys(client4State.players).length, 4);

    assert.strictEqual(client1State.players[client1.sessionId].username, username1);
    assert.strictEqual(client2State.players[client2.sessionId].username, username2);
    assert.strictEqual(client3State.players[client3.sessionId].username, username3);
    assert.strictEqual(client4State.players[client4.sessionId].username, username4);
  });
});
