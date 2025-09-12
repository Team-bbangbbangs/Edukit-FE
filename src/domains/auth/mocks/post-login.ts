import { http, HttpResponse } from 'msw';

import type { LoginBody } from '@/domains/auth/types/auth';

export const postLogin = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginBody;

    const expiresAt = Date.now() + 30 * 60 * 1000;

    if (email === 'admin@edukit.co.kr' && password === 'password1234') {
      return HttpResponse.json(
        {
          code: 'SUCCESS',
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
          code: 'SUCCESS',
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

    if (email === 'test@edukit.co.kr' && password === 'ab12345678') {
      return HttpResponse.json(
        {
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          data: {
            accessToken: `email-not-verified-user-access-token.${expiresAt}`,
            isAdmin: false,
          },
        },
        {
          status: 200,
          headers: {
            'Content-type': 'application/json',
            'Set-Cookie':
              'refreshToken=email-not-verified-user-refresh-token; HttpOnly; Path=/; SameSite=Lax',
          },
        },
      );
    }

    if (email === 'test@edukit.co.kr' && password !== 'password1234!') {
      return HttpResponse.json(
        {
          code: 'A-40008',
          message: '비밀번호가 올바르지 않습니다.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'M-40401',
        message: '존재하지 않는 회원입니다. 회원가입을 진행해주세요.',
      },
      { status: 200 },
    );
  }),
];
