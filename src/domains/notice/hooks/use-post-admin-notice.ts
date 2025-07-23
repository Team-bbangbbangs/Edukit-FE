import { useMutation } from '@tanstack/react-query';

import type { AdminNoticeBody } from '@/domains/notice/types/notice';
import { postAdminNotice } from '@/services/notice/post-admin-notice';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const usePostAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, AdminNoticeBody>({
    mutationFn: postAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
