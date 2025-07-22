import { api } from '@/lib/api';
import type { LoginBody } from '@/types/auth/auth';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const patchResetPassword = async ({ email, password }: LoginBody) => {
  return api.patch<ApiResponseWithoutData>(
    '/api/v1/auth/password',
    {
      email,
      password,
    },
    { skipTokenRefresh: true },
  );
};
