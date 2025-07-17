import { http, HttpResponse } from 'msw';

import type { LoginProp } from '@/types/api/auth';

export const postLogin = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginProp;

    const expiresAt = Date.now() + 30 * 60 * 1000;

    if (email === 'admin@edukit.co.kr' && password === 'password1234') {
      return HttpResponse.json(
        {
          status: 200,
          code: 'EDMT-20002',
          message: '요청에 성공했습니다.',
          data: {
            accessToken: `admin-access-token.${expiresAt}`,
            isAdmin: true,
          },
        },
        {
          status: 200,
          headers: {
            'Content-type': 'application/json',
            'Set-Cookie': 'refreshToken=admin-refresh-token; HttpOnly; Path=/; SameSite=Strict',
          },
        },
      );
    }

    if (email === 'test@edukit.co.kr' && password === 'password1234!') {
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
            'Content-type': 'application/json',
            'Set-Cookie': 'refreshToken=user-refresh-token; HttpOnly; Path=/; SameSite=Lax',
          },
        },
      );
    }

    if (email === 'test@edukit.co.kr' && password !== 'password1234!') {
      return HttpResponse.json(
        {
          status: 401,
          code: 'EDMT-4010107',
          message: '비밀번호가 일치하지 않습니다.',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json(
      {
        status: 401,
        code: 'EDMT-4010107',
        message: '존재하지 않는 회원입니다. 회원가입을 진행해주세요.',
      },
      { status: 401 },
    );
  }),
];
