import type { Response } from '@/types/api/response';
import type { RecordType, CreateStudentRecord } from '@/types/api/student-record';

export const createRecords = async ({
  recordType,
  students,
}: {
  recordType: RecordType;
  students: CreateStudentRecord[];
}): Promise<Response<null>> => {
  const res = await fetch('/api/v1/create-student-records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recordType, students }),
  });

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '학생 기록 생성 실패');
  }

  return json;
};
