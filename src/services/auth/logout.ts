import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const logout = async () => {
  return api.post<ApiResponseWithoutData>('/api/v1/auth/logout', {
    credentials: 'include',
    skipTokenRefresh: true,
  });
};
