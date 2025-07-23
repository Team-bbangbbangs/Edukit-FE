import type { EditAdminNoticeRequest } from '@/domains/notice/types/notice';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

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
