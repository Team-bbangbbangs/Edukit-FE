import type { StudentRecordRequest } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import type { ApiResponseWithoutData } from '@/shared/types/response';

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
