import { api } from '@/lib/api';
import type { StudentRecordRequest } from '@/types/record/record';
import type { ApiResponseWithoutData } from '@/types/shared/response';

export const patchRecordDetail = async (updateStudentRecord: StudentRecordRequest) => {
  return api.patch<ApiResponseWithoutData>(
    `/api/v1/student-records/${updateStudentRecord.recordDetailId}`,
    {
      studentNumber: updateStudentRecord.studentNumber,
      studentName: updateStudentRecord.studentName,
      description: updateStudentRecord.description,
      byteCount: updateStudentRecord.byteCount,
    },
  );
};
