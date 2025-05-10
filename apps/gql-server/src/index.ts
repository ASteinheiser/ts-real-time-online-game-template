import express, { json } from 'express';

const app = express();
const port = process.env.PORT || 4208;

app.use(json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
