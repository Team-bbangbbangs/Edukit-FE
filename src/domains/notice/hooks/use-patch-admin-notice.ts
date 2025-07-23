import { useMutation } from '@tanstack/react-query';

import type { EditAdminNoticeRequest } from '@/domains/notice/types/notice';
import { patchAdminNotice } from '@/services/notice/patch-admin-notice';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const usePatchAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, EditAdminNoticeRequest>({
    mutationFn: patchAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
