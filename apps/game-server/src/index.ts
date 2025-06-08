import { listen } from '@colyseus/tools';
import { setupApp } from './app.config';
import { authClient } from './auth/client';
import { PrismaClient } from './prisma-client';

const PORT = Number(process.env.WS_SERVER_PORT) || 4204;

const prisma = new PrismaClient();
const app = setupApp({ authClient, prisma });

listen(app, PORT);
