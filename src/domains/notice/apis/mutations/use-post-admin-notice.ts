import { useMutation } from '@tanstack/react-query';

import type { AdminNoticeBody } from '@/domains/notice/types/notice';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const postAdminNotice = async ({ category, title, content }: AdminNoticeBody) => {
  return api.post<ApiResponseWithoutData>('/api/v2/admin/notices', {
    category,
    title,
    content,
  });
};

export const usePostAdminNotice = () => {
  return useMutation<ApiResponseWithoutData, Error, AdminNoticeBody>({
    mutationFn: postAdminNotice,
    onError: (error) => {
      alert(error.message);
    },
  });
};
