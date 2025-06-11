import { http, HttpResponse } from 'msw';

import type { SignupTypes } from '@/types/api/auth';

export const postSignup = [
  http.post('api/v1/auth/signup', async ({ request }) => {
    const { email, password } = (await request.json()) as SignupTypes;

    if (email === 'test@naver.com' && password === 'ab12345678') {
      return HttpResponse.json(
        {
          status: 401,
          code: 'EDMT-40001',
          message: '중복된 이메일입니다.',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-20002',
      message: '요청에 성공했습니다.',
    });
  }),
];
