import { api } from '@/lib/api';
import type { AuthResponse } from '@/types/api/auth';

export const reissue = async () => {
  return api.patch<AuthResponse>('/api/v1/auth/reissue', {
    credentials: 'include',
    skipTokenRefresh: true,
  });
};
