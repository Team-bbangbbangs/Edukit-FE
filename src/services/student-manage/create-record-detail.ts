import type { Response } from '@/types/api/response';
import type { CreateRecordDeatilRequestTypes } from '@/types/api/student-record';

export const createRecordDetail = async ({
  accessToken,
  recordType,
  studentRecord,
  semester,
}: CreateRecordDeatilRequestTypes): Promise<Response<null>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student-records/${recordType}/students`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ semester, studentRecord }),
    },
  );

  const json: Response<null> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || '생기부 기록 생성 실패');
  }

  return json;
};
