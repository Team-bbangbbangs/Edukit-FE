import { createMiddleware } from '@mswjs/http-middleware';
import express from 'express';
import { setupServer } from 'msw/node';

import { handlers } from '@/shared/mocks/handlers';

// Express 서버 (API 모킹)
const app = express();
const port = 9090;

app.use(express.json());
app.use(createMiddleware(...handlers));

app.listen(port, () => {
  console.log(`http://localhost:${port} => Mock api 서버 오픈!`);
});

// Jest 테스트용 서버 객체
export const server = setupServer(...handlers);
