import type { Response } from '@/types/api/response';
import type { StudentRecord, RecordType } from '@/types/api/student-record';

export const getRecord = async (recordType: RecordType) => {
  const res = await fetch(`/api/v1/student-records/${recordType}`);

  const json: Response<StudentRecord[]> = await res.json();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  if (!json.data) {
    throw new Error('서버에서 데이터를 받지 못했습니다.');
  }

  return json.data;
};
