import { ApiError } from '@/lib/errors';
import type { Response } from '@/types/api/response';
import type { RecordType, StudentNameTypes } from '@/types/api/student-record';

export const getStudentsName = async (
  recordType: RecordType,
  semester: string,
  accessToken: string | null,
): Promise<StudentNameTypes[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student-records/${recordType}/students?semester=${semester}`,
    {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    },
  );

  const json: Response<{ studentDetails: StudentNameTypes[] }> = await res.json();

  if (!res.ok) {
    throw new ApiError(json.status, json.code, json.message || '데이터 fetch 실패');
  }

  return json.data?.studentDetails ?? [];
};
