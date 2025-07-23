import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { SummaryRecordRequest } from '@/domains/record/types/record';
import { postSummaryRecordDetail } from '@/services/write-record/post-summary-record-detail';
import { trackEvent } from '@/shared/lib/amplitude';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const usePostSummaryRecordDetail = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, SummaryRecordRequest>({
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
