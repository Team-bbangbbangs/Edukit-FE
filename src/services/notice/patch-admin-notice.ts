import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/api/response';

interface PatchAdminNotice {
  id: string;
  categoryId: number;
  title: string;
  content: string;
}

export const patchAdminNotice = async ({ id, categoryId, title, content }: PatchAdminNotice) => {
  return api.patch<ApiResponseWithoutData>(`/api/v1/admin/notices/${id}`, {
    categoryId,
    title,
    content,
  });
};
