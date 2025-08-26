import { http, HttpResponse } from 'msw';

import {
  USER_INFO_DATA,
  NOT_VERIFUED_USER_INFO_DATA,
} from '@/domains/profile/constants/user-info-data';
import { checkAccessToken } from '@/shared/mocks/utils/check-access-token';

export const getProfile = [
  http.get('/api/v1/users/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    const validation = checkAccessToken(authHeader);

    if (!validation.isValid) {
      return HttpResponse.json(
        {
          code: 'A-40102',
          message: '유효하지 않은 토큰입니다.',
        },
        { status: 200 },
      );
    }

    if (validation.isExpired) {
      return HttpResponse.json(
        {
          code: 'A-40102',
          message: '유효하지 않은 토큰입니다.',
        },
        { status: 200 },
      );
    }

    if (validation.isNotVerified) {
      return HttpResponse.json(
        {
          code: 'SUCCESS',
          message: '요청에 성공했습니다.',
          data: NOT_VERIFUED_USER_INFO_DATA,
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
        data: USER_INFO_DATA,
      },
      { status: 200 },
    );
  }),
];
