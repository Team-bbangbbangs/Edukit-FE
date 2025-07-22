import { useQuery } from '@tanstack/react-query';

import { getSummaryRecordDetail } from '@/services/write-record/get-summary-record-detail';
import type { SummaryRecordResponse } from '@/types/record/record';

export const useGetSummaryRecordDetail = (recordId: number) => {
  return useQuery<SummaryRecordResponse>({
    queryKey: ['summary-record-detail', recordId],
    queryFn: () => getSummaryRecordDetail(recordId),
    enabled: !!recordId && recordId > 0 && !isNaN(recordId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
