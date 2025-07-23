import { useQuery } from '@tanstack/react-query';

import type { ProfileResponse } from '@/domains/profile/types/profile';
import { getProfile } from '@/services/profile/get-profile';

export const useGetProfile = () => {
  return useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });
};
