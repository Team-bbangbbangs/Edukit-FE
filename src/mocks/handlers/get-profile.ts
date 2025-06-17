import { http, HttpResponse } from 'msw';

import { USER_INFO_DATA } from '@/constants/user-info-data';
import type { userInfoTypes } from '@/types/api/auth';

export const getProfile = [
  http.get<never, { recordType: userInfoTypes }>('/api/v1/users/profile', () => {
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
