import { useQuery } from '@tanstack/react-query';

import type { SummaryRecordResponse } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

export const getSummaryRecordDetail = async (recordId: number) => {
  return api.get<SummaryRecordResponse>(`/api/v1/student-records/detail/${recordId}`);
};

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
