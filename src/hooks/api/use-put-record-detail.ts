import { useMutation } from '@tanstack/react-query';

import { putRecordDetail } from '@/services/student-manage/put-record-detail';
import type { Response } from '@/types/api/response';
import type { PutRecordDetail } from '@/types/api/student-record';

export const usePutRecordDetail = () => {
  return useMutation<Response<null>, Error, PutRecordDetail>({
    mutationFn: putRecordDetail,
    onSuccess: (data) => {
      console.log('데이터 수정 성공:', data);
    },
    onError: (error) => {
      console.error('데이터 수정 실패:', error.message);
    },
  });
};
