import type { Response } from '@/types/api/response';
import type { PatchRecordDetail } from '@/types/api/student-record';

export const patchRecordDetail = async ({
  accessToken,
  updateStudentRecord,
}: PatchRecordDetail): Promise<Response<null>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student-records/${updateStudentRecord.recordDetailId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        studentNumber: updateStudentRecord.studentNumber,
        studentName: updateStudentRecord.studentName,
        description: updateStudentRecord.description,
        byteCount: updateStudentRecord.byteCount,
      }),
    },
  );

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '학생 기록 수정 실패');
  }

  return json;
};
