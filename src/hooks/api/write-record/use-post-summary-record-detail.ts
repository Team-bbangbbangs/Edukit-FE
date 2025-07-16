import { useMutation, useQueryClient } from '@tanstack/react-query';

import { trackEvent } from '@/lib/amplitude/amplitude';
import { postSummaryRecordDetail } from '@/services/write-record/post-summary-record-detail';
import type { ApiResponseWithoutData } from '@/types/api/response';

interface PostSummaryParams {
  recordId: number;
  description: string;
  byteCount: number;
}

export const usePostSummaryRecordDetail = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, PostSummaryParams>({
    mutationFn: postSummaryRecordDetail,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['summary-record-detail', variables.recordId],
      });

      trackEvent('click_saveReport', {
        final_inputLength: variables.description?.length || 0,
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
