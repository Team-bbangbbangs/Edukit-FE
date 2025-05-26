import { useMutation } from '@tanstack/react-query';

import { login } from '@/services/auth/login';
import type { LoginProp, LoginResponse } from '@/types/api/auth';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginProp>({
    mutationFn: login,
    onSuccess: (data) => {
      console.log('로그인 성공:', data);
    },
    onError: (error) => {
      console.error('로그인 실패:', error.message);
    },
  });
};
