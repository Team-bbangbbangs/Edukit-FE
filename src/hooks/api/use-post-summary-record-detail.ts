import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { postSummaryRecordDetail } from '@/services/write-record/post-summary-record-detail';
import type { Response } from '@/types/api/response';

interface PostSummaryParams {
  recordId: number;
  description: string;
  byteCount: number;
}

export const usePostSummaryRecordDetail = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Response<null>, Error, PostSummaryParams>({
    mutationFn: (params) => postSummaryRecordDetail({ ...params, accessToken }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['summary-record-detail', variables.recordId],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
