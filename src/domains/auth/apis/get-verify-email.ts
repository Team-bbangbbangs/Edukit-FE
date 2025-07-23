import type { VerifyEmailRequest } from '@/domains/auth/types/auth';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const getVerifyEmail = async ({ id, code }: VerifyEmailRequest) => {
  return api.get<ApiResponseWithoutData>('/api/v1/auth/verify-email', {
    params: {
      id: encodeURIComponent(id),
      code: encodeURIComponent(code),
    },
    skipTokenRefresh: true,
  });
};
