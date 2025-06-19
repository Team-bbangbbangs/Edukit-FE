import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { getProfile } from '@/services/auth/get-profile';
import type { UserInfoTypes } from '@/types/api/auth';

export const useGetProfile = () => {
  const { accessToken } = useAuth();

  return useQuery<UserInfoTypes>({
    queryKey: ['profile'],
    queryFn: () => getProfile(accessToken),
  });
};
