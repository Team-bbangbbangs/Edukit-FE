import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateStudentRecordRequest } from '@/domains/record/types/record';
import { createRecordDetail } from '@/services/student-manage/create-record-detail';
import { increaseTotalStudent } from '@/shared/lib/amplitude';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const useCreateRecordDetail = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, CreateStudentRecordRequest>({
    mutationFn: createRecordDetail,
    onSuccess: (data: ApiResponseWithoutData, variables: CreateStudentRecordRequest) => {
      queryClient.invalidateQueries({
        queryKey: ['records', variables.recordType],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentsName', variables.recordType],
      });

      increaseTotalStudent(variables.recordType, 1, 'click_addMoreStudent');
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
