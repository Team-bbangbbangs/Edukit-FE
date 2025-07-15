import { api } from '@/lib/api';
import type { StudentsResponse, RecordType } from '@/types/api/student-record';

interface GetRecordsProps {
  recordType: RecordType;
  semester: string;
}

export const getRecords = async ({ recordType, semester }: GetRecordsProps) => {
  return api.get<StudentsResponse>(`/api/v1/student-records/${recordType}`, {
    params: {
      semester,
    },
  });
};
