import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';

import type {
  RecordsResponse,
  GetRecordsParams,
  RecordsFilters,
} from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import { isUnauthorizedError, isNotPermissionError } from '@/shared/lib/errors';

export const getRecords = async (params: GetRecordsParams) => {
  const searchParams = new URLSearchParams();

  if (params.grade) {
    searchParams.append('grade', params.grade.toString());
  }

  if (params.classNumber) {
    searchParams.append('classNumber', params.classNumber.toString());
  }

  if (params.search) {
    searchParams.append('search', params.search);
  }

  if (params.lastRecordId) {
    searchParams.append('lastRecordId', params.lastRecordId.toString());
  }

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/api/v2/student-records/${params.recordType}?${queryString}`
    : `/api/v2/student-records/${params.recordType}`;

  return api.get<RecordsResponse>(endpoint);
};

export const useGetRecords = (filters: RecordsFilters) => {
  const query = useInfiniteQuery<
    RecordsResponse,
    Error,
    RecordsResponse,
    readonly unknown[],
    number | undefined
  >({
    queryKey: ['records', 'infinite', filters],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getRecords({
        ...filters,
        lastRecordId: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      const records = lastPage.studentRecords;
      if (records.length === 0) return undefined;
      return records[records.length - 1].recordId;
    },
    placeholderData: keepPreviousData,

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
