import { api } from '@/lib/api';
import type { ProfileResponse } from '@/types/profile/profile';

export const getProfile = async () => {
  return api.get<ProfileResponse>('/api/v1/users/profile');
};
