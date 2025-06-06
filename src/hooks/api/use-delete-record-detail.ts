import { useMutation } from '@tanstack/react-query';

import { deleteRecordDetail } from '@/services/student-manage/delete-record-detail';
import type { Response } from '@/types/api/response';

export const useDeleteRecordDetail = () => {
  return useMutation<Response<null>, Error, string>({
    mutationFn: deleteRecordDetail,
    onSuccess: (data) => {
      console.log('데이터 삭제 성공:', data);
    },
    onError: (error) => {
      console.error('데이터 삭제 실패:', error.message);
    },
  });
};
