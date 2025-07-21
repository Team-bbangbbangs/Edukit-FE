import { http, HttpResponse } from 'msw';

import type { PatchAfterLoginPassword } from '@/types/api/auth';

export const patchAfterLoginPassword = [
  http.patch('/api/v1/users/password', async ({ request }) => {
    const { currentPassword, newPassword } = (await request.json()) as PatchAfterLoginPassword;

    if (currentPassword === 'password1234') {
      return HttpResponse.json(
        {
          status: 400,
          code: 'EDMT-4000402',
          message: '현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
        },
        { status: 400 },
      );
    }

    if (currentPassword === 'password123!' && newPassword === 'password123!') {
      return HttpResponse.json(
        {
          status: 400,
          code: 'EDMT-4000403',
          message: '새로운 비밀번호는 기존 비밀번호와 같을 수 없습니다.',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-200',
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });
  }),
];
