import { http, HttpResponse } from 'msw';

export const deleteRecordDetail = [
  http.delete('/api/v1/delete-student-record-detail/:recordId', ({ params }) => {
    const { recordId } = params;

    if (!recordId) {
      return HttpResponse.json(
        { status: 400, code: 'EDMT-40001', message: '잘못된 요청 데이터입니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-20000',
      message: '데이터가 성공적으로 삭제되었습니다.',
    });
  }),
];
