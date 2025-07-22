import { api } from '@/lib/api';
import type { RecordType, StudentNamesResponse } from '@/types/record/record';

export const getStudentsName = async (recordType: RecordType, semester: string) => {
  return api.get<StudentNamesResponse>(`/api/v1/student-records/${recordType}/students`, {
    params: {
      semester,
    },
  });
};
