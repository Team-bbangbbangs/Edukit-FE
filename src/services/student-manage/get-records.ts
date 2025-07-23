import type { StudentRecordsResponse, RecordType } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';

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
