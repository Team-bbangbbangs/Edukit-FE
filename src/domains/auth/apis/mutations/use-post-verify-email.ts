import { useMutation } from '@tanstack/react-query';

import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const postVerifyEmail = async (email: string) => {
  return api.post<ApiResponseWithoutData>(
    '/api/v1/auth/find-password',
    { email },
    { skipTokenRefresh: true },
  );
};

export const usePostVerifyEmail = () => {
  return useMutation<ApiResponseWithoutData, Error, string>({
    mutationFn: postVerifyEmail,
  });
};
