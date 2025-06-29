import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { getSummaryRecordDetail } from '@/services/write-record/get-summary-record-detail';
import type { SummaryRecordTypes } from '@/types/api/student-record';

export const useGetSummaryRecordDetail = (recordId: number) => {
  const { accessToken } = useAuth();

  return useQuery<SummaryRecordTypes>({
    queryKey: ['summary-record-detail', recordId],
    queryFn: () => getSummaryRecordDetail(recordId, accessToken),
    enabled: !!recordId && recordId > 0 && !isNaN(recordId) && !!accessToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
