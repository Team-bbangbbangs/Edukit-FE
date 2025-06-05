import { useMutation } from '@tanstack/react-query';

import { createRecords } from '@/services/student-manage/create-record';
import type { Response } from '@/types/api/response';
import type { CreateRecord } from '@/types/api/student-record';

export const useCreateRecord = () => {
  return useMutation<Response<null>, Error, CreateRecord>({
    mutationFn: createRecords,
    onSuccess: (data) => {
      console.log('생기부 데이터 생성 성공:', data);
    },
    onError: (error) => {
      console.error('생기부 데이터 생성 실패:', error.message);
    },
  });
};
