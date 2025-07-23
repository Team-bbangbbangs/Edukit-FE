import { useQuery } from '@tanstack/react-query';

import type { RecordType, StudentNamesResponse } from '@/domains/record/types/record';
import { getStudentsName } from '@/services/write-record/get-students-name';
import { isUnauthorizedError, isNotFoundError, isNotPermissionError } from '@/shared/lib/errors';

export const useGetStudentsName = (recordType: RecordType, semester: string) => {
  const query = useQuery<StudentNamesResponse>({
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
