import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { postAdminNotice } from '@/services/notice/post-admin-notice';
import type { AdminNoticeRequest } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

export const usePostAdminNotice = () => {
  const { accessToken } = useAuth();

  return useMutation<Response<null>, Error, AdminNoticeRequest>({
    mutationFn: (params) => postAdminNotice({ ...params, accessToken }),
    onError: (error) => {
      alert(error.message);
    },
  });
};
