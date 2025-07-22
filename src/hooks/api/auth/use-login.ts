import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/auth/use-auth';
import { setAmplitudeUserFromAccessToken } from '@/lib/amplitude/amplitude';
import { login } from '@/services/auth/login';
import type { LoginBody, AuthResponse } from '@/types/auth/auth';

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
