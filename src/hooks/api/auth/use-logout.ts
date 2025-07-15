import { reset } from '@amplitude/analytics-browser';
import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/auth/use-auth';
import { logout } from '@/services/auth/logout';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const useLogout = () => {
  const { setAuthData } = useAuth();
  const router = useRouter();

  const handleLogoutCleanup = () => {
    setAuthData(null, null);
    reset();
    router.push('/');
  };

  return useMutation<ApiResponseWithoutData, Error>({
    mutationFn: logout,
    onSuccess: handleLogoutCleanup,
    onError: handleLogoutCleanup,
  });
};
