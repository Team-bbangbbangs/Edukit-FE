import { useMutation } from '@tanstack/react-query';

import { postAdminNotice } from '@/services/notice/post-admin-notice';
import type { AdminNoticeBody } from '@/types/notice/notice';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const usePostAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, AdminNoticeBody>({
    mutationFn: postAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
