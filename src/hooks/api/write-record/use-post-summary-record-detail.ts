import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { trackEvent } from '@/lib/amplitude/amplitude';
import { postSummaryRecordDetail } from '@/services/write-record/post-summary-record-detail';
import type { ApiResponseWithoutData } from '@/types/api/response';

interface PostSummaryParams {
  recordId: number;
  description: string;
  byteCount: number;
}

export const usePostSummaryRecordDetail = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, PostSummaryParams>({
    mutationFn: postSummaryRecordDetail,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['summary-record-detail', variables.recordId],
      });

      trackEvent('click_saveReport', accessToken, {
        final_inputLength: variables.description?.length || 0,
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
