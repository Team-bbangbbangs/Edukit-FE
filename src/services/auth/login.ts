import type { LoginBody, AuthResponse } from '@/domains/auth/types/auth';
import { api } from '@/shared/lib/api';

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
