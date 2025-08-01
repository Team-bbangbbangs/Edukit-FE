import { server } from '@/shared/mocks/server';

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
