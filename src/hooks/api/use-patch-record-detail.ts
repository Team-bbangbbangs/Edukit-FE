import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { patchRecordDetail } from '@/services/student-manage/patch-record-detail';
import type { Response } from '@/types/api/response';
import type { RecordType, UpdateStudentRecordTypes } from '@/types/api/student-record';

type UsePatchRecordDetailParams = {
  recordType: RecordType;
  updateStudentRecord: UpdateStudentRecordTypes;
};

export const usePatchRecordDetail = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Response<null>, Error, UsePatchRecordDetailParams>({
    mutationFn: ({ updateStudentRecord }) =>
      patchRecordDetail({ accessToken, updateStudentRecord }),
    onSuccess: (data: Response<null>, variables: UsePatchRecordDetailParams) => {
      queryClient.invalidateQueries({
        queryKey: ['records', variables.recordType],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
