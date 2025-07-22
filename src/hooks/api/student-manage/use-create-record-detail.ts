import { useMutation, useQueryClient } from '@tanstack/react-query';

import { increaseTotalStudent } from '@/lib/amplitude/amplitude';
import { createRecordDetail } from '@/services/student-manage/create-record-detail';
import type { CreateStudentRecordRequest } from '@/types/record/record';
import type { ApiResponseWithoutData } from '@/types/shared/response';

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
