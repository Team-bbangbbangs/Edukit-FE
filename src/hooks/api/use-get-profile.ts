import { useQuery } from '@tanstack/react-query';

import { getProfile } from '@/services/auth/get-profile';
import type { userInfoTypes } from '@/types/api/auth';

export const useGetProfile = () => {
  return useQuery<userInfoTypes>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });
};
