import { http, HttpResponse } from 'msw';

export const patchEmail = [
  http.patch('/api/v1/users/email', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    if (email === 'test@edukit.co.kr') {
      return HttpResponse.json(
        {
          code: 'M-40908',
          message: '이미 등록된 이메일입니다.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
      },
      { status: 200 },
    );
  }),
];
