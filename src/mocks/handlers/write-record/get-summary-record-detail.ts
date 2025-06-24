import { http, HttpResponse } from 'msw';

import { RECORD_SUMMARY_RECORD_DATA } from '@/constants/student-summary-record-data';

export const getSummaryRecordDetail = [
  http.get('/api/v1/student-records/detail/:recordId', async ({ params }) => {
    const recordId = Number(params.recordId);
    const record = RECORD_SUMMARY_RECORD_DATA.find((record) => record.recordId === recordId);

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
