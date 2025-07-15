import { http, HttpResponse } from 'msw';

import { RECORD_DATA } from '@/constants/record-data';
import type { RecordType } from '@/types/api/student-record';

export const getRecords = [
  http.get<never, { recordType: RecordType }>(
    '/api/v1/student-records/:recordType',
    ({ params }) => {
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
