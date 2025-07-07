import 'dotenv/config';
import { Client } from 'colyseus.js';
import { cli, Options } from '@colyseus/loadtest';
import { WS_ROOM, WS_EVENT, type InputPayload } from '@repo/core-game';
import { MyRoomState } from '../../src/rooms/schema/MyRoomState';
import { generateTestJWT } from '../integration/utils';

const WEBSOCKET_URL = process.env.WEBSOCKET_URL;
if (!WEBSOCKET_URL) throw new Error('WEBSOCKET_URL is not set');

const JOIN_DELAY_MS = 500;

// NOTE: if this is your first time running the load test and it's failing on profile fetch,
// add a test profile row to your local db that matches the userId defined in generateTestJWT

export async function main(options: Options) {
  console.log('joining room...', options);
  await new Promise((resolve) => setTimeout(resolve, JOIN_DELAY_MS));

  const client = new Client(WEBSOCKET_URL);
  client.auth.token = generateTestJWT({});
  const room = await client.joinOrCreate<MyRoomState>(WS_ROOM.GAME_ROOM);

  console.log('joined room successfully!');

  // add this listener otherwise colyseus will show a warning
  room.onMessage(WS_EVENT.PLAYGROUND_MESSAGE_TYPES, () => {});

  room.onMessage(WS_EVENT.PLAYER_INPUT, (payload: InputPayload) => {
    console.log('received player input: ', JSON.stringify(payload));
  });

  room.onStateChange(() => {
    console.log(`state change at: ${Date.now()}`);
  });

  room.onLeave((code) => {
    console.log(`leaving room with code: ${code}`);
  });
}

cli(main);
