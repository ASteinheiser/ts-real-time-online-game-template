import { Client, Room } from 'colyseus.js';
import { cli, Options } from '@colyseus/loadtest';

export async function main(options: Options) {
  // wait 3 seconds before starting load test
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const client = new Client(options.endpoint);
  const room: Room = await client.joinOrCreate(options.roomName, {
    // your join options here...
  });

  console.log('joined successfully!');

  room.onMessage('message-type', (payload) => {
    console.log({ payload });
  });

  room.onStateChange((state) => {
    console.log('state change:', state);
  });

  room.onLeave((code) => {
    console.log('left: ', code);
  });
}

cli(main);
