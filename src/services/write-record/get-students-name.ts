import type { Response } from '@/types/api/response';
import type { RecordType, StudentNameTypes } from '@/types/api/student-record';

export const getStudentsName = async (
  recordType: RecordType,
  semester: string,
): Promise<StudentNameTypes[]> => {
  const res = await fetch(`/api/v1/student-records/${recordType}/students?semester=${semester}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  const json: Response<{ studentDetails: StudentNameTypes[] }> = await res.json();

  return json.data?.studentDetails ?? [];
};
