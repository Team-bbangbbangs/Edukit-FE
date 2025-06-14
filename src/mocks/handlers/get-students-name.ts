import { http, HttpResponse } from 'msw';

import { STUDENT_NAME_DATA } from '@/constants/student-name-data';
import type { RecordType } from '@/types/api/student-record';

export const getStudentsName = [
  http.get<never, { recordType: RecordType }>(
    '/api/v1/student-records/:recordType/students',
    ({ params }) => {
      const { recordType } = params;
      const mockData = STUDENT_NAME_DATA[recordType];

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
