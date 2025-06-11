import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { signup } from '@/services/auth/signup';
import type { SignupTypes } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const useSignup = () => {
  const router = useRouter();

  return useMutation<Response<null>, Error, SignupTypes>({
    mutationFn: signup,
    onSuccess: (data, variables) => {
      console.log(data);
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      console.error('회원가입 실패:', error.message);
      alert(error.message);
    },
  });
};
