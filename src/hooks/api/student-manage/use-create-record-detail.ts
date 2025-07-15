import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { increaseTotalStudent } from '@/lib/amplitude/amplitude';
import { createRecordDetail } from '@/services/student-manage/create-record-detail';
import type { ApiResponseWithoutData } from '@/types/api/response';
import type { CreateRecordDetail } from '@/types/api/student-record';

export const useCreateRecordDetail = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, CreateRecordDetail>({
    mutationFn: createRecordDetail,
    onSuccess: (data: ApiResponseWithoutData, variables: CreateRecordDetail) => {
      queryClient.invalidateQueries({
        queryKey: ['records', variables.recordType],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentsName', variables.recordType],
      });

      increaseTotalStudent(variables.recordType, 1, accessToken, 'click_addMoreStudent');
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
