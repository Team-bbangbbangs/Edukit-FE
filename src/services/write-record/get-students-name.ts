import type { RecordType, StudentNamesResponse } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

export const getStudentsName = async (recordType: RecordType, semester: string) => {
  return api.get<StudentNamesResponse>(`/api/v1/student-records/${recordType}/students`, {
    params: {
      semester,
    },
  });
};
