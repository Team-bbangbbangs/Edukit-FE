import { useQuery } from '@tanstack/react-query';

import type { SummaryRecordResponse } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import { isUnauthorizedError, isNotPermissionError } from '@/shared/lib/errors';

export const getRecordDetail = async (recordId: number) => {
  return api.get<SummaryRecordResponse>(`/api/v2/student-records/detail/${recordId}`);
};

export const useGetRecordDetail = (recordId: number) => {
  const query = useQuery<SummaryRecordResponse>({
    queryKey: ['record-detail', recordId],
    queryFn: () => getRecordDetail(recordId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 0,
  });

  const isUnauthorized = query.error ? isUnauthorizedError(query.error) : false;
  const isNotPermission = query.error ? isNotPermissionError(query.error) : false;

  return {
    ...query,
    isUnauthorized,
    isNotPermission,
  };
};
