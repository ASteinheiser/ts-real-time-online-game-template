import { app } from './app';

const PORT = process.env.PORT || 4208;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
