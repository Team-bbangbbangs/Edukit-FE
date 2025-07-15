import { api } from '@/lib/api';
import type { RecordType, studentDetails } from '@/types/api/student-record';

export const getStudentsName = async (recordType: RecordType, semester: string) => {
  return api.get<studentDetails>(`/api/v1/student-records/${recordType}/students`, {
    params: {
      semester,
    },
  });
};
