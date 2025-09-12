import { http, HttpResponse } from 'msw';

export const getVerifyEmail = [
  http.get('/api/v1/auth/verify-email', ({ request }) => {
    const url = new URL(request.url);
    const id = decodeURIComponent(url.searchParams.get('id') || '');
    const code = decodeURIComponent(url.searchParams.get('code') || '');

    if (id === 'test@naver.com' && code === 'abc') {
      return HttpResponse.json(
        {
          code: 'SUCCESS',
          message: '이메일 인증이 완료되었습니다.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'A-40102',
        message: '유효하지 않은 토큰입니다.',
      },
      { status: 200 },
    );
  }),
];
