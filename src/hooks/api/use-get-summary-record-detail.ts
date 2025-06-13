import { useQuery } from '@tanstack/react-query';

import { getSummaryRecordDetail } from '@/services/write-record/get-summary-record-detail';
import type { SummaryRecordTypes } from '@/types/api/student-record';

export const useGetSummaryRecordDetail = (recordId: number) => {
  return useQuery<SummaryRecordTypes>({
    queryKey: ['summary-record-detail', recordId],
    queryFn: () => getSummaryRecordDetail(recordId),
  });
};
