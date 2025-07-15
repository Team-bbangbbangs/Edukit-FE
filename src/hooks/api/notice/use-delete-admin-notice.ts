import { useMutation } from '@tanstack/react-query';

import { deleteAdminNotice } from '@/services/notice/delete-admin-notice';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const useDeleteAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, string>({
    mutationFn: deleteAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
