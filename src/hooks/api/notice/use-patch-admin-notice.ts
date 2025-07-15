import { useMutation } from '@tanstack/react-query';

import { patchAdminNotice } from '@/services/notice/patch-admin-notice';
import type { PatchAdminNotice } from '@/types/api/notice';
import type { ApiResponseWithoutData } from '@/types/api/response';

export const usePatchAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, PatchAdminNotice>({
    mutationFn: patchAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
