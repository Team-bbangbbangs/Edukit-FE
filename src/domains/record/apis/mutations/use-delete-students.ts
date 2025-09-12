import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, DeleteStudents>({
    mutationFn: deleteStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });

      queryClient.invalidateQueries({
        queryKey: ['studentsName'],
      });

      queryClient.invalidateQueries({
        queryKey: ['records'],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
