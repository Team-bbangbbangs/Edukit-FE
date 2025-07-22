import { api } from '@/lib/api';
import type { AuthResponse, SignupBody } from '@/types/auth/auth';

export const signup = async (signupData: SignupBody) => {
  return api.post<AuthResponse>('/api/v1/auth/signup', signupData, {
    credentials: 'include',
    skipTokenRefresh: true,
  });
};
