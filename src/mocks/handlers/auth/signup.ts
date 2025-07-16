import { http, HttpResponse } from 'msw';

import type { SignupTypes } from '@/types/api/auth';

export const signup = [
  http.post('/api/v1/auth/signup', async ({ request }) => {
    const { email } = (await request.json()) as SignupTypes;

    if (email === 'test123@edukit.co.kr') {
      return HttpResponse.json(
        {
          status: 401,
          code: 'EDMT-40001',
          message: '이미 등록된 회원입니다.',
        },
        { status: 401 },
      );
    }

    const expiresAt = Date.now() + 30 * 60 * 1000;

    return HttpResponse.json(
      {
        status: 200,
        code: 'EDMT-20002',
        message: '요청에 성공했습니다.',
        data: {
          accessToken: `user-access-token.${expiresAt}`,
          isAdmin: false,
        },
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': 'refreshToken=user-refresh-token; HttpOnly; Path=/; SameSite=Lax',
        },
      },
    );
  }),
];
