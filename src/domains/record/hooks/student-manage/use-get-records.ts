import { useQuery } from '@tanstack/react-query';

import type { RecordType, StudentRecordsResponse } from '@/domains/record/types/record';
import { getRecords } from '@/services/student-manage/get-records';
import { isUnauthorizedError, isNotFoundError, isNotPermissionError } from '@/shared/lib/errors';

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
