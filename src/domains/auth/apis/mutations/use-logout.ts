import { reset } from '@amplitude/analytics-browser';
import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { clearAmplitudeAccessToken } from '@/shared/lib/amplitude';
import { api } from '@/shared/lib/api';
import { useAuth } from '@/shared/providers/auth-provider';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const logout = async () => {
  return api.post<ApiResponseWithoutData>('/api/v1/auth/logout', {
    credentials: 'include',
    skipTokenRefresh: true,
  });
};

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
