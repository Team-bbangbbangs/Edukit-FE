import { useMutation } from '@tanstack/react-query';

import { api } from '@/shared/lib/api';
import { type ApiResponseWithoutData } from '@/shared/types/response';

interface DeleteStudents {
  studentIds: number[];
}

export const deleteStudents = async ({ studentIds }: DeleteStudents) => {
  return api.delete<ApiResponseWithoutData>('/api/v1/students', {
    body: { studentIds },
  });
};

export const useDeleteStudents = () => {
  return useMutation<ApiResponseWithoutData, Error, DeleteStudents>({
    mutationFn: deleteStudents,
  });
};
