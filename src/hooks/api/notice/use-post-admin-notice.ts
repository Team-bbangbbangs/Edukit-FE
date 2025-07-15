import { useMutation } from '@tanstack/react-query';

import { postAdminNotice } from '@/services/notice/post-admin-notice';
import type { AdminNotice } from '@/types/api/notice';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const usePostAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, AdminNotice>({
    mutationFn: postAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
