import { useMutation } from '@tanstack/react-query';

import { createRecords } from '@/services/student-manage/create-records';
import type { Response } from '@/types/api/response';
import type { CreateRecords } from '@/types/api/student-record';

export const useCreateRecords = () => {
  return useMutation<Response<null>, Error, CreateRecords>({
    mutationFn: createRecords,
    onSuccess: (data) => {
      console.log('생기부 데이터 생성 성공:', data);
    },
    onError: (error) => {
      console.error('생기부 데이터 생성 실패:', error.message);
    },
  });
};
