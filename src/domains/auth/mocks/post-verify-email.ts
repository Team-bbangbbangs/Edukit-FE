import { http, HttpResponse } from 'msw';

export const postVerifyEmail = [
  http.post('/api/v1/auth/find-password', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    if (email === 'lcs3623@naver.co') {
      return HttpResponse.json(
        {
          status: 404,
          code: 'EDMT-4040401',
          message: '존재하지 않는 회원입니다. 회원가입을 진행해주세요.',
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(
      { status: 200, code: 'EDMT-200', message: '요청이 성공했습니다.' },
      { status: 200 },
    );
  }),
];
