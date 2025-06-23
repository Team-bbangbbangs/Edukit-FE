import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { isUnauthorizedError, isNotFoundError } from '@/lib/errors';
import { getStudentsName } from '@/services/write-record/get-students-name';
import type { RecordType, StudentNameTypes } from '@/types/api/student-record';

export const useGetStudentsName = (recordType: RecordType, semester: string) => {
  const { accessToken } = useAuth();

  const query = useQuery<StudentNameTypes[]>({
    queryKey: ['studentsName', recordType, semester],
    queryFn: () => getStudentsName(recordType, semester, accessToken),
    retry: 1,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    isUnauthorized: isUnauthorizedError(query.error),
    isNotFound: isNotFoundError(query.error),
  };
};
