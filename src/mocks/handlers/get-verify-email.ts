import { http, HttpResponse } from 'msw';

export const getVerifyEmail = [
  http.get('/api/v1/auth/verify-email', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');

    if (email === 'test@naver.com' && token === 'abc') {
      return HttpResponse.json({
        status: 200,
        code: 'EDMT-20002',
        message: '이메일 인증이 완료되었습니다.',
      });
    }

    return HttpResponse.json(
      {
        status: 400,
        code: 'EDMT-40003',
        message: '인증 토큰이 유효하지 않습니다.',
      },
      { status: 400 },
    );
  }),
];
