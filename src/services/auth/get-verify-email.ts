import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const getVerifyEmail = async (id: string, code: string) => {
  return api.get<ApiResponseWithoutData>('/api/v1/auth/verify-email', {
    params: {
      id: encodeURIComponent(id),
      code: encodeURIComponent(code),
    },
    skipTokenRefresh: true,
  });
};
