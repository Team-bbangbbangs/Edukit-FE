import { http, HttpResponse } from 'msw';

export const patchEmail = [
  http.patch('/api/v1/users/email', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    if (email === 'test@edukit.co.kr') {
      return HttpResponse.json(
        {
          status: 409,
          code: 'EDMT-4090101',
          message: '이미 등록된 회원입니다.',
        },
        { status: 409 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-200',
      message: '이메일이 성공적으로 변경되었습니다.',
    });
  }),
];
