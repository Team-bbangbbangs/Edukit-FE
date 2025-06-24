import { http, HttpResponse } from 'msw';

export const getVerifyEmail = [
  http.get('/api/v1/auth/verify-email', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const code = url.searchParams.get('code');

    if (id === 'test@naver.com' && code === 'abc') {
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
