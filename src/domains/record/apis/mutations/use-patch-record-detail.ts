import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { RecordType, StudentRecordRequest } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

interface UsePatchRecordDetailParams {
  recordType: RecordType;
  updateStudentRecord: StudentRecordRequest;
}

export const patchRecordDetail = async (updateStudentRecord: StudentRecordRequest) => {
  return api.patch<ApiResponseWithoutData>(
    `/api/v1/student-records/${updateStudentRecord.recordDetailId}`,
    {
      studentNumber: updateStudentRecord.studentNumber,
      studentName: updateStudentRecord.studentName,
      description: updateStudentRecord.description,
      byteCount: updateStudentRecord.byteCount,
    },
  );
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
