import { useMutation } from '@tanstack/react-query';

import type { RecordType } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

export const downloadExcel = async (recordType: RecordType) => {
  const blob = await api.get<Blob>(`/api/v2/student-records/${recordType}/excel`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `${recordType}-records.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const useDownloadExcel = () => {
  return useMutation<void, Error, RecordType>({
    mutationFn: downloadExcel,
    onError: (error) => {
      alert(error.message);
    },
  });
};
