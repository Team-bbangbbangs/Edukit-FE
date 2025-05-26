import { http, HttpResponse } from 'msw';

import type { LoginProp } from '@/types/api/auth';

export const authHandler = [
  http.post('/api/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginProp;

    if (email === 'test@naver.com' && password === '1234') {
      return HttpResponse.json({
        status: 200,
        code: 'EDMT-20002',
        message: '요청에 성공했습니다.',
        data: {
          accessToken: { id: '123', role: 'student' },
          nickName: '에듀메이트',
          school: 'highSchool',
          profileImage: '/images/test.png',
        },
      });
    }

    return HttpResponse.json(
      {
        status: 401,
        code: 'EDMT-40001',
        message: '이메일 또는 비밀번호가 틀렸습니다.',
      },
      { status: 401 },
    );
  }),
];
