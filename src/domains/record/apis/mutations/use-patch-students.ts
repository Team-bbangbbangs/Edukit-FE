import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type Student } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import { type ApiResponseWithoutData } from '@/shared/types/response';

export const patchStudents = async (studentInfo: Student) => {
  return api.patch<ApiResponseWithoutData>(`/api/v1/students/${studentInfo.studentId}`, {
    grade: studentInfo.grade,
    classNumber: studentInfo.classNumber,
    studentNumber: studentInfo.studentNumber,
    studentName: studentInfo.studentName,
    recordTypes: studentInfo.recordTypes,
  });
};

export const usePatchStudents = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, Student>({
    mutationFn: patchStudents,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });

      queryClient.invalidateQueries({
        queryKey: ['student', variables.studentId],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
