import { api } from '@/lib/api';
import type { VerifyEmailRequest } from '@/types/auth/auth';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const getVerifyEmail = async ({ id, code }: VerifyEmailRequest) => {
  return api.get<ApiResponseWithoutData>('/api/v1/auth/verify-email', {
    params: {
      id: encodeURIComponent(id),
      code: encodeURIComponent(code),
    },
    skipTokenRefresh: true,
  });
};
