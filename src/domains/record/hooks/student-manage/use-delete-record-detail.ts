import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { RecordType } from '@/domains/record/types/record';
import { deleteRecordDetail } from '@/services/student-manage/delete-record-detail';
import { increaseTotalStudent } from '@/shared/lib/amplitude';
import type { ApiResponseWithoutData } from '@/shared/types/response';

interface UseDeleteRecordDetailParams {
  recordType: RecordType;
  recordId: string;
}

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
