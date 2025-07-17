import { api } from '@/lib/api';
import type { LoginProp, AuthResponse } from '@/types/api/auth';

export const login = async ({ email, password }: LoginProp) => {
  return api.post<AuthResponse>(
    '/api/v1/auth/login',
    { email, password },
    {
      credentials: 'include',
      skipTokenRefresh: true,
    },
  );
};
