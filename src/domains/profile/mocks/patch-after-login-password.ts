import { http, HttpResponse } from 'msw';

import type { EditPasswordBody } from '@/domains/profile/types/profile';

export const patchAfterLoginPassword = [
  http.patch('/api/v1/users/password', async ({ request }) => {
    const { currentPassword, newPassword } = (await request.json()) as EditPasswordBody;

    if (currentPassword === 'password1234') {
      return HttpResponse.json(
        {
          code: 'M-40006',
          message: '현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
        },
        { status: 200 },
      );
    }

    if (currentPassword === 'password123!' && newPassword === 'password123!') {
      return HttpResponse.json(
        {
          code: 'M-40007',
          message: '새로운 비밀번호는 기존 비밀번호와 같을 수 없습니다.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
      },
      {
        status: 200,
      },
    );
  }),
];
