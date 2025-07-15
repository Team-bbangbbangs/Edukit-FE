import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const postVerifyEmail = async (email: string) => {
  return api.post<ApiResponseWithoutData>(
    '/api/v1/auth/find-password',
    { email },
    { skipTokenRefresh: true },
  );
};
