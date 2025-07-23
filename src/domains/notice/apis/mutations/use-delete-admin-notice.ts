import { useMutation } from '@tanstack/react-query';

import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const deleteAdminNotice = async (id: string) => {
  return api.delete<ApiResponseWithoutData>(`/api/v1/admin/notices/${id}`);
};

export const useDeleteAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, string>({
    mutationFn: deleteAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
