import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateStudentRecordsRequest } from '@/domains/record/types/record';
import { createRecords } from '@/services/student-manage/create-records';
import { increaseTotalStudent } from '@/shared/lib/amplitude';
import type { ApiResponseWithoutData } from '@/shared/types/response';

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
