import { useInfiniteQuery } from '@tanstack/react-query';

import type {
  StudentsResponse,
  GetStudentsParams,
  StudentFilters,
} from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

export const getStudent = async (params: GetStudentsParams = {}) => {
  const searchParams = new URLSearchParams();

  if (params.grades && params.grades.length > 0) {
    params.grades.forEach((grade) => searchParams.append('grades', grade.toString()));
  }

  if (params.classNumbers && params.classNumbers.length > 0) {
    params.classNumbers.forEach((classNumber) =>
      searchParams.append('classNumbers', classNumber.toString()),
    );
  }

  if (params.recordTypes && params.recordTypes.length > 0) {
    params.recordTypes.forEach((recordType) => searchParams.append('recordTypes', recordType));
  }

  if (params.lastStudentId) {
    searchParams.append('lastStudentId', params.lastStudentId.toString());
  }

  if (params.pageSize && params.pageSize !== 20) {
    searchParams.append('pageSize', params.pageSize.toString());
  }

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/student?${queryString}` : '/api/v1/student';

  return api.get<StudentsResponse>(endpoint);
};

export const useGetStudent = (filters: StudentFilters = {}) => {
  return useInfiniteQuery<
    StudentsResponse,
    Error,
    StudentsResponse,
    readonly unknown[],
    number | undefined
  >({
    queryKey: ['students', 'infinite', filters],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getStudent({
        ...filters,
        lastStudentId: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      const students = lastPage.students;
      if (students.length === 0) return undefined;
      return students[students.length - 1].studentId;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 0,
  });
};
