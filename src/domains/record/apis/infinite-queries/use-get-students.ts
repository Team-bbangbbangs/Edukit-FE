import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';

import type {
  StudentsResponse,
  GetStudentsParams,
  StudentFilters,
} from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import { isUnauthorizedError, isNotPermissionError } from '@/shared/lib/errors';

export const getStudents = async (params: GetStudentsParams = {}) => {
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

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/students?${queryString}` : '/api/v1/students';

  return api.get<StudentsResponse>(endpoint);
};

export const useGetStudents = (filters: StudentFilters = {}) => {
  const query = useInfiniteQuery<
    StudentsResponse,
    Error,
    StudentsResponse,
    readonly unknown[],
    number | undefined
  >({
    queryKey: ['students', 'infinite', filters],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getStudents({
        ...filters,
        lastStudentId: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      const students = lastPage.students;
      if (students.length === 0) return undefined;
      return students[students.length - 1].studentId;
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
