import { createMiddleware } from '@mswjs/http-middleware';
import express from 'express';

import { handlers } from '@/shared/mocks/handlers';

const app = express();
const port = 9090;

app.use(express.json());
app.use(createMiddleware(...handlers));

app.listen(port, () => {
  console.log(`http://localhost:${port} => Mock api 서버 오픈!`);
});
