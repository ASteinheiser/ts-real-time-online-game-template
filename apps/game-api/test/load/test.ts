import { Client } from 'colyseus.js';
import { cli, Options } from '@colyseus/loadtest';
import { MyRoomState } from '../../src/rooms/schema/MyRoomState';

const JOIN_DELAY_MS = 500;

export async function main(options: Options) {
  await new Promise((resolve) => setTimeout(resolve, JOIN_DELAY_MS));

  const client = new Client(options.endpoint);
  const room = await client.joinOrCreate<MyRoomState>(options.roomName);

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
