import { api } from '@/lib/api';
import type { LoginProp } from '@/types/api/auth';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const patchResetPassword = async ({ email, password }: LoginProp) => {
  return api.patch<ApiResponseWithoutData>(
    '/api/v1/auth/password',
    {
      email,
      password,
    },
    { skipTokenRefresh: true },
  );
};
