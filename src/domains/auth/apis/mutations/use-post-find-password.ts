import { useMutation } from '@tanstack/react-query';

import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const postFindPassword = async (email: string) => {
  return api.post<ApiResponseWithoutData>(
    '/api/v2/auth/find-password',
    { email },
    { skipTokenRefresh: true },
  );
};

export const usePostFindPassword = () => {
  return useMutation<ApiResponseWithoutData, Error, string>({
    mutationFn: postFindPassword,
  });
};
