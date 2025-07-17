import { useQuery } from '@tanstack/react-query';

import { getProfile } from '@/services/profile/get-profile';
import type { UserInfoTypes } from '@/types/api/auth';

export const useGetProfile = () => {
  return useQuery<UserInfoTypes>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });
};
