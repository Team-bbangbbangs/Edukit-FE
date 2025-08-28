import { useMutation } from '@tanstack/react-query';

import { type ExcelUploadResponse } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

interface ExcelUploadRequest {
  file: File;
}

export const postUploadExcel = async ({ file }: ExcelUploadRequest) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<ExcelUploadResponse>('/api/v1/student/excel', formData);
};

export const usePostUploadExcel = () => {
  return useMutation<ExcelUploadResponse, Error, ExcelUploadRequest>({
    mutationFn: postUploadExcel,
  });
};
