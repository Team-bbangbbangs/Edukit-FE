import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type ExcelUploadResponse } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

interface ExcelUploadRequest {
  file: File;
}

export const postUploadExcel = async ({ file }: ExcelUploadRequest) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<ExcelUploadResponse>('/api/v1/students/excel', formData);
};

export const usePostUploadExcel = () => {
  const queryClient = useQueryClient();

  return useMutation<ExcelUploadResponse, Error, ExcelUploadRequest>({
    mutationFn: postUploadExcel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });

      queryClient.invalidateQueries({
        queryKey: ['studentsName'],
      });

      queryClient.invalidateQueries({
        queryKey: ['records'],
      });
    },
  });
};
