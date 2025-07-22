import { api } from '@/lib/api';
import type { StudentRecordsResponse, RecordType } from '@/types/record/record';

interface GetRecordsProps {
  recordType: RecordType;
  semester: string;
}

export const getRecords = async ({ recordType, semester }: GetRecordsProps) => {
  return api.get<StudentRecordsResponse>(`/api/v1/student-records/${recordType}`, {
    params: {
      semester,
    },
  });
};
