import { useQuery } from '@tanstack/react-query';

import type { RecordType, StudentRecordsResponse } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import { isUnauthorizedError, isNotFoundError, isNotPermissionError } from '@/shared/lib/errors';

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
