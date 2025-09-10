import { http, HttpResponse } from 'msw';

export const postFindPassword = [
  http.post('/api/v2/auth/find-password', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    if (email === 'lcs3623@naver.co') {
      return HttpResponse.json(
        {
          code: 'M-40401',
          message: '존재하지 않는 회원입니다. 회원가입을 진행해주세요.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json({ code: 'SUCCESS', message: '요청이 성공했습니다.' }, { status: 200 });
  }),
];
