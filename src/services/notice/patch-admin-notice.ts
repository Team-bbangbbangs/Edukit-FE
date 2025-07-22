import { api } from '@/lib/api';
import type { EditAdminNoticeRequest } from '@/types/notice/notice';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const patchAdminNotice = async ({
  id,
  categoryId,
  title,
  content,
}: EditAdminNoticeRequest) => {
  return api.patch<ApiResponseWithoutData>(`/api/v1/admin/notices/${id}`, {
    categoryId,
    title,
    content,
  });
};
