import { http, HttpResponse } from 'msw';

import {
  USER_INFO_DATA,
  NOT_VERIFUED_USER_INFO_DATA,
} from '@/domains/profile/constants/user-info-data';
import { checkAccessToken } from '@/mocks/utils/check-access-token';

export const getProfile = [
  http.get('/api/v1/users/profile', ({ request }) => {
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
          status: 200,
          code: 'EDMT-200',
          message: '요청에 성공했습니다.',
          data: NOT_VERIFUED_USER_INFO_DATA,
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        status: 200,
        code: 'EDMT-200',
        message: '요청에 성공했습니다.',
        data: USER_INFO_DATA,
      },
      { status: 200 },
    );
  }),
];
