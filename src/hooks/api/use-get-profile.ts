import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { getProfile } from '@/services/auth/get-profile';
import type { UserInfoTypes } from '@/types/api/auth';

export const useGetProfile = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    throw new Error('로그인 상태가 아닙니다.');
  }

  return useQuery<UserInfoTypes>({
    queryKey: ['profile'],
    queryFn: () => getProfile(accessToken),
  });
};
