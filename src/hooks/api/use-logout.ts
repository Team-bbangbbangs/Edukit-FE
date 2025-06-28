import { reset } from '@amplitude/analytics-browser';
import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/auth/use-auth';
import { logout } from '@/services/auth/logout';
import type { Response } from '@/types/api/response';

export const useLogout = () => {
  const { accessToken, setAccessToken, setIsAdmin } = useAuth();
  const router = useRouter();

  return useMutation<Response<void>, Error>({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('로그인 상태가 아닙니다.');
      }
      return logout(accessToken);
    },
    onSuccess: () => {
      setAccessToken(null);
      setIsAdmin(false);
      reset();
      router.push('/');
    },
    onError: () => {
      setAccessToken(null);
      setIsAdmin(false);
      reset();
      router.push('/');
    },
  });
};
