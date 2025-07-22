import { useMutation } from '@tanstack/react-query';

import { patchAdminNotice } from '@/services/notice/patch-admin-notice';
import type { EditAdminNoticeRequest } from '@/types/notice/notice';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const usePatchAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, EditAdminNoticeRequest>({
    mutationFn: patchAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
