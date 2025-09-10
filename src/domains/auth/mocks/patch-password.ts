import { http, HttpResponse } from 'msw';

import type { PatchPasswordBody } from '@/domains/auth/types/auth';

export const patchPassword = [
  http.patch('/api/v2/auth/password', async ({ request }) => {
    const { verificationCode, password } = (await request.json()) as PatchPasswordBody;

    if (password === 'ab13696802!') {
      return HttpResponse.json(
        {
          code: 'A-40009',
          message: '새로운 비밀번호는 기존 비밀번호와 같을 수 없습니다.',
        },
        { status: 200 },
      );
    }

    if (verificationCode === '1234') {
      return HttpResponse.json(
        {
          code: 'A-40102',
          message: '유효하지 않은 토큰입니다.',
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
