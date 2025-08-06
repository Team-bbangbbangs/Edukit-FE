import { http, HttpResponse } from 'msw';

import { STUDENT_DATA } from '@/domains/record/constants/student-data';
import type { RecordType } from '@/domains/record/types/record';
import { checkAccessToken } from '@/shared/mocks/utils/check-access-token';

export const getStudentsName = [
  http.get<never, { recordType: RecordType }>(
    '/api/v1/student-records/:recordType/students',
    ({ params, request }) => {
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

      const { recordType } = params;
      const mockData = STUDENT_DATA[recordType];

      return HttpResponse.json(
        {
          status: 200,
          code: 'EDMT-200',
          message: '요청이 성공했습니다.',
          data: {
            studentDetails: mockData,
          },
        },
        { status: 200 },
      );
    },
  ),
];
