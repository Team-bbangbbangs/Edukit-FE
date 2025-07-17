import { api } from '@/lib/api';
import type { ApiResponseWithoutData } from '@/types/api/response';
import type { UpdateStudentRecordTypes } from '@/types/api/student-record';

export const patchRecordDetail = async (updateStudentRecord: UpdateStudentRecordTypes) => {
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
