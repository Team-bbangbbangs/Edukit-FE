import { useQuery } from '@tanstack/react-query';

import { getStudentsName } from '@/services/write-record/get-students-name';
import type { RecordType, StudentNameTypes } from '@/types/api/student-record';

export const useGetStudentsName = (recordType: RecordType, semester: string) => {
  return useQuery<StudentNameTypes[]>({
    queryKey: ['studentsName', recordType, semester],
    queryFn: () => getStudentsName(recordType, semester),
  });
};
