import { startStandaloneServer } from '@apollo/server/standalone';
import { server } from './server';
import { createContext } from './context';

const PORT = Number(process.env.PORT) || 4208;

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: createContext,
});

console.log(`🚀 Server listening at: ${url}`);
