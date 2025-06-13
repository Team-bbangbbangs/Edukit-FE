import { http, HttpResponse } from 'msw';

export const postSummaryRecordDetail = [
  http.post('/api/v1/student-records/detail/:recordId', async ({ params }) => {
    const { recordId } = params;

    if (!recordId) {
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
      { status: 200, code: 'EDMT-200', message: '요청이 성공했습니다.' },
      { status: 200 },
    );
  }),
];
