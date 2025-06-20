import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/auth/use-auth';
import { login } from '@/services/auth/login';
import type { LoginProp, AuthResponse } from '@/types/api/auth';

export const useLogin = () => {
  const router = useRouter();

  const { setAccessToken } = useAuth();

  return useMutation<AuthResponse, Error, LoginProp>({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      router.push('/');
    },
  });
};
