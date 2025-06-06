import { useMutation } from '@tanstack/react-query';

import { createRecordDetail } from '@/services/student-manage/create-record-detail';
import type { Response } from '@/types/api/response';
import type { CreateRecordDetail } from '@/types/api/student-record';

export const useCreateRecordDetail = () => {
  return useMutation<Response<null>, Error, CreateRecordDetail>({
    mutationFn: createRecordDetail,
    onSuccess: (data) => {
      console.log('생기부 데이터 생성 성공:', data);
    },
    onError: (error) => {
      console.error('생기부 데이터 생성 실패:', error.message);
    },
  });
};
