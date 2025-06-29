import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { isUnauthorizedError, isNotFoundError, isNotPermissionError } from '@/lib/errors';
import { getStudentsName } from '@/services/write-record/get-students-name';
import type { RecordType, StudentNameTypes } from '@/types/api/student-record';

export const useGetStudentsName = (recordType: RecordType, semester: string) => {
  const { accessToken } = useAuth();

  const query = useQuery<StudentNameTypes[]>({
    queryKey: ['studentsName', recordType],
    queryFn: () => getStudentsName(recordType, semester, accessToken),
    retry: 0,
  });

  return {
    ...query,
    isUnauthorized: isUnauthorizedError(query.error),
    isNotFound: isNotFoundError(query.error),
    isNotPermission: isNotPermissionError(query.error),
  };
};
