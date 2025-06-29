import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { deleteRecordDetail } from '@/services/student-manage/delete-record-detail';
import type { Response } from '@/types/api/response';
import type { RecordType } from '@/types/api/student-record';

type UseDeleteRecordDetailParams = {
  recordType: RecordType;
  recordId: string;
};

export const useDeleteRecordDetail = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Response<null>, Error, UseDeleteRecordDetailParams>({
    mutationFn: ({ recordId }) => deleteRecordDetail({ accessToken, recordId }),
    onSuccess: (data: Response<null>, variables: UseDeleteRecordDetailParams) => {
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
