import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { SummaryRecordRequest } from '@/domains/record/types/record';
import { trackEvent } from '@/shared/lib/amplitude';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const postSummaryRecordDetail = async ({
  recordId,
  description,
  byteCount,
}: SummaryRecordRequest) => {
  return api.post<ApiResponseWithoutData>(`/api/v1/student-records/detail/${recordId}`, {
    description,
    byteCount,
  });
};

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
