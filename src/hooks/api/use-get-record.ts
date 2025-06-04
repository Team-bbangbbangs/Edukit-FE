import { useQuery } from '@tanstack/react-query';

import { getRecord } from '@/services/student-manage/get-record';
import type { RecordType, StudentRecord } from '@/types/api/student-record';

export const useGetRocord = (recordtype: RecordType) => {
  return useQuery<StudentRecord[]>({
    queryKey: ['record', recordtype],
    queryFn: () => getRecord(recordtype),
  });
};
