import { useQuery } from '@tanstack/react-query';

import { isUnauthorizedError, isNotFoundError, isNotPermissionError } from '@/lib/errors';
import { getStudentsName } from '@/services/write-record/get-students-name';
import type { RecordType, studentDetails } from '@/types/api/student-record';

export const useGetStudentsName = (recordType: RecordType, semester: string) => {
  const query = useQuery<studentDetails>({
    queryKey: ['studentsName', recordType],
    queryFn: () => getStudentsName(recordType, semester),
    retry: 0,
  });

  return {
    ...query,
    isUnauthorized: isUnauthorizedError(query.error),
    isNotFound: isNotFoundError(query.error),
    isNotPermission: isNotPermissionError(query.error),
  };
};
