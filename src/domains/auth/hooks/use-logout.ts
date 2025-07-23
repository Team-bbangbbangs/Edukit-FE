import { reset } from '@amplitude/analytics-browser';
import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { logout } from '@/services/auth/logout';
import { clearAmplitudeAccessToken } from '@/shared/lib/amplitude';
import { useAuth } from '@/shared/providers/auth-provider';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const useLogout = () => {
  const { setAuthData } = useAuth();
  const router = useRouter();

  const handleLogoutCleanup = () => {
    setAuthData(null, null);
    reset();
    clearAmplitudeAccessToken();
    router.push('/');
  };

  return useMutation<ApiResponseWithoutData, Error>({
    mutationFn: logout,
    onSuccess: handleLogoutCleanup,
    onError: handleLogoutCleanup,
  });
};
