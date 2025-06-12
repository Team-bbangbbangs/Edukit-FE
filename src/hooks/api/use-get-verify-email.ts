import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { getVerifyEmail } from '@/services/auth/get-verify-email';
import type { Response } from '@/types/api/response';

export const useGetVerifyEmail = () => {
  const router = useRouter();

  return useMutation<Response<null>, Error, { email: string; token: string }>({
    mutationFn: ({ email, token }) => getVerifyEmail(email, token),
    onSuccess: (data) => {
      console.log('인증 성공:', data);
      router.replace('/');
    },
    onError: (error) => {
      console.error('이메일 인증 실패:', error.message);
    },
  });
};
