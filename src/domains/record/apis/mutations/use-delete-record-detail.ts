import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { RecordType } from '@/domains/record/types/record';
import { increaseTotalStudent } from '@/shared/lib/amplitude';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

export const deleteRecordDetail = async (recordId: string) => {
  return api.delete<ApiResponseWithoutData>(`/api/v1/student-records/${recordId}`);
};

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
