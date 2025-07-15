import { api } from '@/lib/api';
import type { AuthResponse, SignupTypes } from '@/types/api/auth';

export const signup = async (signupData: SignupTypes) => {
  return api.post<AuthResponse>('/api/v1/auth/signup', signupData, {
    credentials: 'include',
    skipTokenRefresh: true,
  });
};
