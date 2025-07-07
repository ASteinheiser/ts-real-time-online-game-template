import { Client } from 'colyseus.js';
import { cli, Options } from '@colyseus/loadtest';
import { WS_ROOM } from '@repo/core-game';
import { MyRoomState } from '../../src/rooms/schema/MyRoomState';

const WEBSOCKET_URL = process.env.VITE_WEBSOCKET_URL;
if (!WEBSOCKET_URL) throw new Error('VITE_WEBSOCKET_URL is not set');

const JOIN_DELAY_MS = 500;

export async function main(options: Options) {
  console.log('joining room...', options);
  await new Promise((resolve) => setTimeout(resolve, JOIN_DELAY_MS));

  const client = new Client(WEBSOCKET_URL);
  const room = await client.joinOrCreate<MyRoomState>(WS_ROOM.GAME_ROOM);

  console.log('joined room successfully!');

  // add this listener otherwise colyseus will show a warning
  room.onMessage('__playground_message_types', () => {});

  room.onMessage('playerInput', (payload) => {
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
