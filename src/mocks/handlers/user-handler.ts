import { http, HttpResponse } from 'msw';

export const userHandler = [
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: 'abc123',
      firstName: 'John',
      lastName: 'Doe',
    });
  }),
];
