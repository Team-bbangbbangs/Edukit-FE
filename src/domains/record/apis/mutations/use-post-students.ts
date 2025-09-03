import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type CreateStudentRequest } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import { type ApiResponseWithoutData } from '@/shared/types/response';

export const postStudents = async (studentInfo: CreateStudentRequest) => {
  return api.post<ApiResponseWithoutData>('/api/v1/students', {
    grade: studentInfo.grade,
    classNumber: studentInfo.classNumber,
    studentNumber: studentInfo.studentNumber,
    studentName: studentInfo.studentName,
    recordTypes: studentInfo.recordTypes,
  });
};

export const usePostStudents = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, CreateStudentRequest>({
    mutationFn: postStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
