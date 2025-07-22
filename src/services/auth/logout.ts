import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const logout = async () => {
  return api.post<ApiResponseWithoutData>('/api/v1/auth/logout', {
    credentials: 'include',
    skipTokenRefresh: true,
  });
};
