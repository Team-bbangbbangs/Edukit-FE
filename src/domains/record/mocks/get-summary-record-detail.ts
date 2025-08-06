import { http, HttpResponse } from 'msw';

import { STUDENT_DATA } from '@/domains/record/constants/student-data';
import { checkAccessToken } from '@/shared/mocks/utils/check-access-token';

export const getSummaryRecordDetail = [
  http.get('/api/v1/student-records/detail/:recordId', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    const validation = checkAccessToken(authHeader);

    if (!validation.isValid) {
      return HttpResponse.json(
        {
          status: 401,
          code: 'EDMT-4010101',
          message: '유효하지 않은 토큰입니다.',
        },
        { status: 401 },
      );
    }

    if (validation.isExpired) {
      return HttpResponse.json(
        {
          status: 401,
          code: 'EDMT-4010102',
          message: '만료된 토큰입니다.',
        },
        { status: 401 },
      );
    }

    if (validation.isNotVerified) {
      return HttpResponse.json(
        {
          status: 403,
          code: 'EDMT-4030101',
          message: '권한이 부족한 사용자입니다.',
        },
        { status: 403 },
      );
    }

    const recordId = Number(params.recordId);
    const allStudentData = Object.values(STUDENT_DATA).flat();
    const record = allStudentData.find((record) => record.recordId === recordId);
    if (!record) {
      return HttpResponse.json(
        {
          status: 404,
          code: 'EDMT-4040204',
          message: '해당 학생에 대한 생활기록부 기록이 존재하지 않습니다.',
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(
      {
        status: 200,
        code: 'EDMT-200',
        message: '요청이 성공했습니다.',
        data: {
          description: record.description,
          byteCount: record.byteCount,
        },
      },
      { status: 200 },
    );
  }),
];
