import { useMutation, useQueryClient } from '@tanstack/react-query';

import { increaseTotalStudent } from '@/lib/amplitude/amplitude';
import { createRecords } from '@/services/student-manage/create-records';
import type { CreateStudentRecordsRequest } from '@/types/record/record';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const useCreateRecords = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, CreateStudentRecordsRequest>({
    mutationFn: createRecords,
    onSuccess: (data: ApiResponseWithoutData, variables: CreateStudentRecordsRequest) => {
      queryClient.invalidateQueries({
        queryKey: ['records', variables.recordType],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentsName', variables.recordType],
      });

      const addedCount = variables.studentRecords.length;
      increaseTotalStudent(variables.recordType, addedCount, 'click_generateStudent');
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
