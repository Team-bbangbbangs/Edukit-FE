import { useQuery } from '@tanstack/react-query';

import { isUnauthorizedError, isNotFoundError, isNotPermissionError } from '@/lib/errors';
import { getRecords } from '@/services/student-manage/get-records';
import type { RecordType, StudentRecordsResponse } from '@/types/record/record';

export const useGetRecords = (recordType: RecordType) => {
  const query = useQuery<StudentRecordsResponse>({
    queryKey: ['records', recordType],
    queryFn: () => getRecords({ recordType, semester: '2025-1' }),
    retry: 0,
  });

  return {
    ...query,
    isUnauthorized: isUnauthorizedError(query.error),
    isNotFound: isNotFoundError(query.error),
    isNotPermission: isNotPermissionError(query.error),
  };
};
