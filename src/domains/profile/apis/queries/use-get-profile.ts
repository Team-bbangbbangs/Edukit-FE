import { useQuery } from '@tanstack/react-query';

import type { ProfileResponse } from '@/domains/profile/types/profile';
import { api } from '@/shared/lib/api';

export const getProfile = async () => {
  return api.get<ProfileResponse>('/api/v1/users/profile');
};

export const useGetProfile = () => {
  return useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });
};
