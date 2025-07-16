import { useMutation, useQueryClient } from '@tanstack/react-query';

import { increaseTotalStudent } from '@/lib/amplitude/amplitude';
import { deleteRecordDetail } from '@/services/student-manage/delete-record-detail';
import type { ApiResponseWithoutData } from '@/types/api/response';
import type { RecordType } from '@/types/api/student-record';

type UseDeleteRecordDetailParams = {
  recordType: RecordType;
  recordId: string;
};

export const useDeleteRecordDetail = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, UseDeleteRecordDetailParams>({
    mutationFn: ({ recordId }) => deleteRecordDetail(recordId),
    onSuccess: (data: ApiResponseWithoutData, variables: UseDeleteRecordDetailParams) => {
      queryClient.invalidateQueries({
        queryKey: ['records', variables.recordType],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentsName', variables.recordType],
      });
      increaseTotalStudent(variables.recordType, -1, 'click_deleteStudent');
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
