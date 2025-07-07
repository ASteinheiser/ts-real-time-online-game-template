import { ColyseusTestServer } from '@colyseus/testing';
import { Room } from '@colyseus/core';
import type { GraphQLResponse } from '@apollo/server';
import { WS_EVENT } from '@repo/core-game';
import { MyRoomState } from '../../src/rooms/schema/MyRoomState';

interface CreateWSClientArgs {
  server: ColyseusTestServer;
  room: Room<MyRoomState>;
  username?: string;
}

export const createWSClient = async ({ server, room, username }: CreateWSClientArgs) => {
  const client = await server.connectTo(room, { username });

  // register onMessage handler otherwise colyseus throws a warning
  client.onMessage(WS_EVENT.PLAYGROUND_MESSAGE_TYPES, () => {});

  return client;
};

export const parseGQLData = <Type>(result: GraphQLResponse<Type>) => {
  return result.body.kind === 'single'
    ? (result.body.singleResult?.data as Type)
    : (result.body.initialResult.data as Type);
};
