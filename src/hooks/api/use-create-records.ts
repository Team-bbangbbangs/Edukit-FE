import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { createRecords } from '@/services/student-manage/create-records';
import type { Response } from '@/types/api/response';
import type { CreateRecordsInput } from '@/types/api/student-record';

export const useCreateRecords = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Response<null>, Error, CreateRecordsInput>({
    mutationFn: (params) => createRecords({ ...params, accessToken }),
    onSuccess: (data: Response<null>, variables: CreateRecordsInput) => {
      queryClient.invalidateQueries({
        queryKey: ['records', variables.recordType],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentsName', variables.recordType],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
