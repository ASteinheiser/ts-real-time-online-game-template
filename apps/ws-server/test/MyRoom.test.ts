import 'mocha';
import assert from 'assert';
import { ColyseusTestServer, boot } from '@colyseus/testing';

import appConfig from '../src/app.config';
import { MyRoomState } from '../src/rooms/schema/MyRoomState';

describe('testing your Colyseus app', () => {
  let colyseus: ColyseusTestServer;

  before(async () => (colyseus = await boot(appConfig)));
  after(async () => colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  it('connecting into a room', async () => {
    const room = await colyseus.createRoom<MyRoomState>('my_room');

    const client1 = await colyseus.connectTo(room, { username: 'test-user' });
    // register onMessage handler otherwise colyseus throws a warning
    client1.onMessage('__playground_message_types', () => {});

    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);

    await room.waitForNextPatch();

    const client1State = client1.state.toJSON();

    assert.strictEqual(Object.keys(client1State.players).length, 1);
    assert.strictEqual(client1State.players[client1.sessionId].username, 'test-user');
    assert.strictEqual(Object.keys(client1State.enemies).length, 1);
    assert.strictEqual(typeof client1State.enemies[0].id, 'string');
  });
});
