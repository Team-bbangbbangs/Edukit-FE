import { setupServer } from 'msw/node';

import { handlers } from '@/shared/mocks/handlers';

const server = setupServer(...handlers);

export const setupMSW = () => {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error',
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });
};

export const resetMSWHandlers = () => {
  server.resetHandlers();
};

export { server };
