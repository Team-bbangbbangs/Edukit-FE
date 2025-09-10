import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

interface PostRecordDetailParams {
  recordId: number;
  description: string;
}

export const postRecordDetail = async (params: PostRecordDetailParams) => {
  return api.post<ApiResponseWithoutData>(`/api/v2/student-records/detail/${params.recordId}`, {
    description: params.description,
  });
};

export const usePostRecordDetail = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, PostRecordDetailParams>({
    mutationFn: (updateInfo) => postRecordDetail(updateInfo),
    onSuccess: (data: ApiResponseWithoutData, variables: PostRecordDetailParams) => {
      queryClient.invalidateQueries({
        queryKey: ['record-detail', variables.recordId],
      });

      queryClient.invalidateQueries({
        queryKey: ['records'],
      });
    },
  });
};
