import { useMutation } from '@tanstack/react-query';

import { postSummaryRecordDetail } from '@/services/write-record/post-summary-record-detail';

export const usePostSummaryRecordDetail = () => {
  return useMutation({
    mutationFn: postSummaryRecordDetail,
    onSuccess: (data) => {
      console.log('생기부 데이터 생성 성공:', data);
    },
    onError: (error) => {
      console.error('생기부 데이터 생성 실패:', error.message);
    },
  });
};
