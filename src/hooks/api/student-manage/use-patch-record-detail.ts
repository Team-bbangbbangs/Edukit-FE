import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchRecordDetail } from '@/services/student-manage/patch-record-detail';
import type { ApiResponseWithoutData } from '@/types/api/response';
import type { RecordType, UpdateStudentRecordTypes } from '@/types/api/student-record';

type UsePatchRecordDetailParams = {
  recordType: RecordType;
  updateStudentRecord: UpdateStudentRecordTypes;
};

export const usePatchRecordDetail = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, UsePatchRecordDetailParams>({
    mutationFn: ({ updateStudentRecord }) => patchRecordDetail(updateStudentRecord),
    onSuccess: (data: ApiResponseWithoutData, variables: UsePatchRecordDetailParams) => {
      queryClient.invalidateQueries({
        queryKey: ['records', variables.recordType],
      });
      queryClient.invalidateQueries({
        queryKey: ['studentsName', variables.recordType],
      });
      queryClient.invalidateQueries({
        queryKey: ['summary-record-detail', variables.updateStudentRecord.recordDetailId],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
