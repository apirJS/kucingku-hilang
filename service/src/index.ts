import RedisStore from 'connect-redis';
import express from 'express';
import session from 'express-session';
import { createClient } from 'redis';
import { getEnv } from './lib/utils';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const redisUrl = getEnv('REDIS_URL') || 'redis://localhost:6379';
const redisClient = createClient({
  url: redisUrl,
});
// const prismaClient = new PrismaClient();

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: getEnv('SESSION_SECRET_KEY', false),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.BUN_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 10 minutes
    },
  })
);

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

app.use((req, res) => {
  res.status(404).send('Not found, bang');
});

const PORT = process.env.BACKEND_PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
