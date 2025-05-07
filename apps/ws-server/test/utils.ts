import { ColyseusTestServer } from '@colyseus/testing';
import { Room } from '@colyseus/core';
import { MyRoomState } from '../src/rooms/schema/MyRoomState';

interface CreateClientArgs {
  server: ColyseusTestServer;
  room: Room<MyRoomState>;
  username?: string;
}

export const createClient = async ({ server, room, username }: CreateClientArgs) => {
  const client = await server.connectTo(room, { username });

  // register onMessage handler otherwise colyseus throws a warning
  client.onMessage('__playground_message_types', () => {});

  return client;
};
