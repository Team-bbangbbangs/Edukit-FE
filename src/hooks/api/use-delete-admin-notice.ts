import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { deleteAdminNotice } from '@/services/notice/delete-admin-notice';
import type { DeleteAdminNoticeRequest } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

export const useDeleteAdminNotice = () => {
  const { accessToken } = useAuth();

  return useMutation<Response<null>, Error, DeleteAdminNoticeRequest>({
    mutationFn: (params) => deleteAdminNotice({ ...params, accessToken }),
    onError: (error) => {
      alert(error.message);
    },
  });
};
