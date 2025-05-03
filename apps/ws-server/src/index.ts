import { listen } from '@colyseus/tools';
import app from './app.config';

const PORT = Number(process.env.WS_SERVER_PORT) || 4204;

listen(app, PORT);
