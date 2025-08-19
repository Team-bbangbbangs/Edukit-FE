import { http, HttpResponse } from 'msw';

export const postSendEmail = [
  http.post('/api/v1/auth/email/send-verification', async () => {
    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '이메일이 발송되었습니다.',
      },
      { status: 200 },
    );
  }),
];
