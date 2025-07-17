import { api } from '@/lib/api';
import type { UserInfoTypes } from '@/types/api/auth';

export const getProfile = async () => {
  return api.get<UserInfoTypes>('/api/v1/users/profile');
};
