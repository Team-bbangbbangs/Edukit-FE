import { ApiError } from '@/lib/errors';
import type { Response } from '@/types/api/response';
import type { StudentsResponse, RecordType } from '@/types/api/student-record';

interface GetRecordsProps {
  recordType: RecordType;
  accessToken: string | null;
  semester: string;
}

export const getRecords = async ({ recordType, accessToken, semester }: GetRecordsProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student-records/${recordType}?semester=${semester}`,
    {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    },
  );

  const json: Response<StudentsResponse> = await res.json();

  if (!res.ok) {
    throw new ApiError(json.status, json.code, json.message || '데이터 fetch 실패');
  }

  if (!json.data) {
    throw new Error('서버에서 데이터를 받지 못했습니다.');
  }

  return json.data;
};
