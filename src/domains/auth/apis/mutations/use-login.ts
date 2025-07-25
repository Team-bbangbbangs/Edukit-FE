import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import type { LoginBody, AuthResponse } from '@/domains/auth/types/auth';
import { setAmplitudeUserFromAccessToken } from '@/shared/lib/amplitude';
import { api } from '@/shared/lib/api';
import { useAuth } from '@/shared/providers/auth-provider';

export const login = async ({ email, password }: LoginBody) => {
  return api.post<AuthResponse>(
    '/api/v1/auth/login',
    { email, password },
    {
      credentials: 'include',
      skipTokenRefresh: true,
    },
  );
};

export const useLogin = () => {
  const router = useRouter();

  const { setAuthData } = useAuth();

  return useMutation<AuthResponse, Error, LoginBody>({
    mutationFn: login,
    onSuccess: (data) => {
      setAuthData(data.accessToken, data.isAdmin);

      setAmplitudeUserFromAccessToken({
        accessToken: data.accessToken,
      });

      router.push('/');
    },
  });
};
