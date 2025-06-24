import { http, HttpResponse } from 'msw';

export const postLogout = [
  http.post('/api/v1/auth/logout', async () => {
    return HttpResponse.json(
      { status: 200, code: 'EDMT-200', message: '요청이 성공했습니다.' },
      { status: 200 },
    );
  }),
];
