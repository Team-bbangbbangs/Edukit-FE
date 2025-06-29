import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { isUnauthorizedError, isNotFoundError, isNotPermissionError } from '@/lib/errors';
import { getRecords } from '@/services/student-manage/get-records';
import type { RecordType, StudentsResponse } from '@/types/api/student-record';

export const useGetRecords = (recordType: RecordType) => {
  const { accessToken } = useAuth();

  const query = useQuery<StudentsResponse>({
    queryKey: ['records', recordType],
    queryFn: () => getRecords({ recordType, accessToken, semester: '2025-1' }),
    retry: 0,
  });

  return {
    ...query,
    isUnauthorized: isUnauthorizedError(query.error),
    isNotFound: isNotFoundError(query.error),
    isNotPermission: isNotPermissionError(query.error),
  };
};
