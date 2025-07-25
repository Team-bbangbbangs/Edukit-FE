import { http, HttpResponse } from 'msw';

export const getCheckValidNickname = [
  http.get('/api/v1/users/nickname', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');

    if (nickname === 'ㅇㅇ') {
      return HttpResponse.json({
        status: 200,
        code: 'EDMT-200',
        message: '요청에 성공했습니다.',
        data: {
          isInvalid: true,
          isDuplicated: false,
        },
      });
    }

    if (nickname === '선생님1') {
      return HttpResponse.json({
        status: 200,
        code: 'EDMT-200',
        message: '요청에 성공했습니다.',
        data: {
          isInvalid: false,
          isDuplicated: true,
        },
      });
    }

    return HttpResponse.json({
      status: 200,
      code: 'EDMT-200',
      message: '요청에 성공했습니다.',
      data: {
        isInvalid: false,
        isDuplicated: false,
      },
    });
  }),
];
