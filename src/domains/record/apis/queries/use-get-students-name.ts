import { useQuery } from '@tanstack/react-query';

import type {
  RecordType,
  StudentNamesResponse,
  StudentsNamesFilters,
} from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

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
  return useQuery<StudentNamesResponse>({
    queryKey: ['studentsName', recordType, filters],
    queryFn: () => getStudentsName(recordType, filters),
    retry: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
