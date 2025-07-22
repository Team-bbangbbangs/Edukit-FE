import { api } from '@/lib/api';
import type { LoginBody, AuthResponse } from '@/types/auth/auth';

export const login = async ({ email, password }: LoginBody) => {
  return api.post<AuthResponse>(
    '/api/v1/auth/login',
    { email, password },
    {
      credentials: 'include',
      skipTokenRefresh: true,
    },
  );
};
