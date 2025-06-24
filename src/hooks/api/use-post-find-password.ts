import { useMutation } from '@tanstack/react-query';

import { postFindPassword } from '@/services/auth/post-find-password';
import type { Response } from '@/types/api/response';

export const usePostFindPassword = () => {
  return useMutation<Response<null>, Error, string>({
    mutationFn: postFindPassword,
  });
};
