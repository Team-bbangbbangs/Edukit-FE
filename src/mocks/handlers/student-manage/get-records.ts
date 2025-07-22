import { http, HttpResponse } from 'msw';

import { RECORD_DATA } from '@/constants/record-data';
import { checkAccessToken } from '@/mocks/utils/check-access-token';
import type { RecordType } from '@/types/record/record';

export const getRecords = [
  http.get<never, { recordType: RecordType }>(
    '/api/v1/student-records/:recordType',
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

      const records = RECORD_DATA[recordType];

      return HttpResponse.json({
        status: 200,
        code: 'EDMT-20002',
        message: '요청에 성공했습니다.',
        data: records,
      });
    },
  ),
];
