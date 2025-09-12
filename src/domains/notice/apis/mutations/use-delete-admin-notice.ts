import { useMutation } from '@tanstack/react-query';

import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const deleteAdminNotice = async (noticeId: number) => {
  return api.delete<ApiResponseWithoutData>(`/api/v2/admin/notices/${noticeId}`);
};

export const useDeleteAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, number>({
    mutationFn: deleteAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
