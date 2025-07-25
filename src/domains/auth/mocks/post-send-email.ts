import { http, HttpResponse } from 'msw';

export const postSendEmail = [
  http.post('/api/v1/auth/email/send-verification', async () => {
    return HttpResponse.json({
      status: 200,
      code: 'EDMT-200',
      message: '이메일이 발송되었습니다.',
    });
  }),
];
