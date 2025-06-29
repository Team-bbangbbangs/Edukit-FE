import { http, HttpResponse } from 'msw';

export const postSendEmail = [
  http.post('/api/v1/auth/email/send-verification', async () => {
    return HttpResponse.json(
      { status: 200, code: 'EDMT-200', message: '요청이 성공했습니다.' },
      { status: 200 },
    );
  }),
];
