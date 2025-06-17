import { useMutation } from '@tanstack/react-query';

import { logout } from '@/services/auth/logout';
import type { Response } from '@/types/api/response';

export const useLogout = () => {
  return useMutation<Response<void>, Error>({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log('로그아웃 성공:', data);
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error.message);
    },
  });
};
