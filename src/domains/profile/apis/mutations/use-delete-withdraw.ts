import { useMutation } from '@tanstack/react-query';

import { api } from '@/shared/lib/api';
import { type ApiResponseWithoutData } from '@/shared/types/response';

export const deleteWithdraw = async () => {
  return api.delete<ApiResponseWithoutData>('/api/v1/users/withdraw');
};

export const useGetCheckValidNickname = () => {
  return useMutation<ApiResponseWithoutData, Error>({
    mutationFn: deleteWithdraw,
    onError: (error) => {
      alert(error.message);
    },
  });
};
