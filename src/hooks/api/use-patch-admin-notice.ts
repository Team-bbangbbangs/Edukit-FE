import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { patchAdminNotice } from '@/services/notice/patch-admin-notice';
import type { PatchAdminNoticeRequest } from '@/types/api/notice';
import type { Response } from '@/types/api/response';

export const usePatchAdminNotice = () => {
  const { accessToken } = useAuth();

  return useMutation<Response<null>, Error, PatchAdminNoticeRequest>({
    mutationFn: (params) => patchAdminNotice({ ...params, accessToken }),
    onError: (error) => {
      alert(error.message);
    },
  });
};
