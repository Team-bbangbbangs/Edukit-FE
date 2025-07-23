import type { AuthResponse, SignupBody } from '@/domains/auth/types/auth';
import { api } from '@/shared/lib/api';

export const signup = async (signupData: SignupBody) => {
  return api.post<AuthResponse>('/api/v1/auth/signup', signupData, {
    credentials: 'include',
    skipTokenRefresh: true,
  });
};
