import { http, HttpResponse } from 'msw';

import type { LoginProp } from '@/types/api/auth';

export const patchResetPassword = [
  http.patch('/api/v1/auth/password', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginProp;

    if (email === 'lcs3623@naver.com' && password === 'ab13696802!') {
      return HttpResponse.json(
        {
          status: 400,
          code: 'EDMT-4000106',
          message: '새로운 비밀번호는 기존 비밀번호와 같을 수 없습니다.',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-20000',
      message: '데이터가 성공적으로 수정되었습니다.',
    });
  }),
];
