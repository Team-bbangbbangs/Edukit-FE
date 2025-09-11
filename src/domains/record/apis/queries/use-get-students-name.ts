import { useQuery } from '@tanstack/react-query';

import type {
  RecordType,
  StudentNamesResponse,
  StudentsNamesFilters,
} from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import { isUnauthorizedError, isNotPermissionError } from '@/shared/lib/errors';

export const getStudentsName = async (
  recordType: RecordType,
  filters: StudentsNamesFilters = {},
) => {
  return api.get<StudentNamesResponse>(`/api/v1/students/${recordType}`, {
    params: {
      ...filters,
    },
  });
};

export const useGetStudentsName = (recordType: RecordType, filters: StudentsNamesFilters = {}) => {
  const query = useQuery<StudentNamesResponse>({
    queryKey: ['studentsName', recordType, filters],
    queryFn: () => getStudentsName(recordType, filters),
    retry: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const isUnauthorized = query.error ? isUnauthorizedError(query.error) : false;
  const isNotPermission = query.error ? isNotPermissionError(query.error) : false;

  return {
    ...query,
    isUnauthorized,
    isNotPermission,
  };
};
