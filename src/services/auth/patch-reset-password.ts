import type { LoginBody } from '@/domains/auth/types/auth';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

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
