import { useQuery } from '@tanstack/react-query';

import { getProfile } from '@/services/profile/get-profile';
import type { ProfileResponse } from '@/types/profile/profile';

export const useGetProfile = () => {
  return useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });
};
