import { describe, test, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { ColyseusTestServer, boot } from '@colyseus/testing';

import appConfig from '../src/app.config';
import { MyRoomState } from '../src/rooms/schema/MyRoomState';

describe('testing your Colyseus app', () => {
  let colyseus: ColyseusTestServer;

  beforeAll(async () => (colyseus = await boot(appConfig)));
  afterAll(async () => colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  test('connecting into a room', async () => {
    // `room` is the server-side Room instance reference.
    const room = await colyseus.createRoom<MyRoomState>('my_room', {});

    // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
    const client1 = await colyseus.connectTo(room);

    // make your assertions
    expect(client1.sessionId).toBe(room.clients[0].sessionId);

    // wait for state sync
    await room.waitForNextPatch();

    expect(client1.state.toJSON()).toEqual({ players: {}, enemies: [] });
  });
});
