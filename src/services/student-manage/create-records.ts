import type { Response } from '@/types/api/response';
import type { CreateRecords } from '@/types/api/student-record';

export const createRecords = async ({
  recordType,
  studentRecords,
  semester,
  accessToken,
}: CreateRecords): Promise<Response<null>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student-records/${recordType}/students/batch`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ recordType, studentRecords, semester }),
    },
  );

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '학생 기록 생성 실패');
  }

  return json;
};
