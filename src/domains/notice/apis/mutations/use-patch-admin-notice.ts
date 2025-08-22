import { useMutation } from '@tanstack/react-query';

import type { EditAdminNoticeRequest } from '@/domains/notice/types/notice';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const patchAdminNotice = async ({
  noticeId,
  category,
  title,
  content,
  fileKeys,
}: EditAdminNoticeRequest) => {
  return api.patch<ApiResponseWithoutData>(`/api/v2/admin/notices/${noticeId}`, {
    category,
    title,
    content,
    fileKeys,
  });
};

export const usePatchAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, EditAdminNoticeRequest>({
    mutationFn: patchAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
