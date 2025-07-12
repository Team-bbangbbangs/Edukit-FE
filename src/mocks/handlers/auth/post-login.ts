import { http, HttpResponse } from 'msw';

import type { LoginProp } from '@/types/api/auth';

export const postLogin = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginProp;

    if (email === 'admin@edukit.co.kr' && password === 'password1234') {
      return HttpResponse.json(
        {
          status: 200,
          code: 'EDMT-20002',
          message: '요청에 성공했습니다.',
          data: {
            accessToken: 'admin-access-token',
            isAdmin: true,
          },
        },
        { status: 200 },
      );
    }

    if (email === 'test@edukit.co.kr' && password === 'password1234') {
      return HttpResponse.json(
        {
          status: 200,
          code: 'EDMT-20002',
          message: '요청에 성공했습니다.',
          data: {
            accessToken: 'user-access-token',
            isAdmin: false,
          },
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        status: 401,
        code: 'EDMT-4010107',
        message: '비밀번호가 일치하지 않습니다.',
      },
      { status: 401 },
    );
  }),
];
