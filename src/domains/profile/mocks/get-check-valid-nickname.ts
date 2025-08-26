import { http, HttpResponse } from 'msw';

export const getCheckValidNickname = [
  http.get('/api/v1/users/nickname', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');

    if (nickname === 'ㅇㅇ') {
      return HttpResponse.json(
        {
          code: 'M-40004',
          message: '입력하신 닉네임은 유효하지 않습니다.',
        },
        { status: 200 },
      );
    }

    if (nickname === '선생님1') {
      return HttpResponse.json(
        {
          code: 'M-40005',
          message: '입력하신 닉네임은 중복된 닉네임입니다.',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
      },
      { status: 200 },
    );
  }),
];
