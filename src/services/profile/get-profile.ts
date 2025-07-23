import type { ProfileResponse } from '@/domains/profile/types/profile';
import { api } from '@/shared/lib/api';

export const getProfile = async () => {
  return api.get<ProfileResponse>('/api/v1/users/profile');
};
