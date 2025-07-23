import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import type { LoginBody, AuthResponse } from '@/domains/auth/types/auth';
import { login } from '@/services/auth/login';
import { setAmplitudeUserFromAccessToken } from '@/shared/lib/amplitude';
import { useAuth } from '@/shared/providers/auth-provider';

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
