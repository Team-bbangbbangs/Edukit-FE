import { useQuery } from '@tanstack/react-query';

import {
  getSubjectRecord,
  getBehaviorRecord,
  getCareerRecord,
  getClubRecord,
  getFreeRecord,
} from '@/services/student-manage/get-record';
import type { RecordType, StudentRecord } from '@/types/api/student-record';

export const useGetRocord = (recordtype: RecordType) => {
  const queryFn = () => {
    switch (recordtype) {
      case 'subject':
        return getSubjectRecord();
      case 'behavior':
        return getBehaviorRecord();
      case 'career':
        return getCareerRecord();
      case 'free':
        return getFreeRecord();
      case 'club':
        return getClubRecord();
    }
  };

  return useQuery<StudentRecord[]>({
    queryKey: [recordtype],
    queryFn: queryFn,
  });
};
