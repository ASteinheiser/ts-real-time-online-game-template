import express, { json, type Express } from 'express';

export const app: Express = express();

app.use(json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});
