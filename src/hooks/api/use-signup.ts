import { useMutation } from '@tanstack/react-query';

import { signup } from '@/services/auth/signup';
import type { SignupTypes } from '@/types/api/auth';
import type { Response } from '@/types/api/response';

export const useSignup = () => {
  return useMutation<Response<null>, Error, SignupTypes>({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
