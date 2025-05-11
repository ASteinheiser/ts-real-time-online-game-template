import { startStandaloneServer } from '@apollo/server/standalone';
import { server } from './server';

const PORT = Number(process.env.PORT) || 4208;

const { url } = await startStandaloneServer(server, { listen: { port: PORT } });

console.log(`🚀 Server listening at: ${url}`);
