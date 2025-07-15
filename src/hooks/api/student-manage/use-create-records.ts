import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { increaseTotalStudent } from '@/lib/amplitude/amplitude';
import { createRecords } from '@/services/student-manage/create-records';
import type { ApiResponseWithoutData } from '@/types/api/response';
import type { CreateRecords } from '@/types/api/student-record';

export const useCreateRecords = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, CreateRecords>({
    mutationFn: createRecords,
    onSuccess: (data: ApiResponseWithoutData, variables: CreateRecords) => {
      queryClient.invalidateQueries({
        queryKey: ['records', variables.recordType],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentsName', variables.recordType],
      });

      const addedCount = variables.studentRecords.length;
      increaseTotalStudent(variables.recordType, addedCount, accessToken, 'click_generateStudent');
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
