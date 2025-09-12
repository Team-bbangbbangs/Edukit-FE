import { http, HttpResponse } from 'msw';

import { checkAccessToken } from '@/shared/mocks/utils/check-access-token';

export const getRecordDetail = [
  http.get('/api/v2/student-records/detail/:recordId', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    const validation = checkAccessToken(authHeader);

    if (!validation.isValid) {
      return HttpResponse.json(
        {
          code: 'A-40101',
          message: '토큰이 누락되었습니다.',
        },
        { status: 200 },
      );
    }

    if (validation.isExpired) {
      return HttpResponse.json(
        {
          code: 'A-40101',
          message: '토큰이 누락되었습니다.',
        },
        { status: 200 },
      );
    }

    if (validation.isNotVerified) {
      return HttpResponse.json(
        {
          code: 'A-40304',
          message: '접근 권한이 없는 사용자입니다. 교사 인증을 진행해주세요.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청이 성공했습니다.',
        data: {
          description: '수학 수업에 적극적으로 참여하는 모습을 보인다.',
        },
      },
      { status: 200 },
    );
  }),
];
