export type RecordType = 'subject' | 'behavior' | 'career' | 'free' | 'club';

export type StudentRecord = {
  recordDetailId: string;
  studentNumber: string;
  studentName: string;
  description: string;
};

export type UpdateStudentRecordTypes = {
  recordDetailId: string;
  studentNumber: string;
  studentName: string;
  description: string;
  byteCount: number;
};

export type StudentsResponse = {
  students: StudentRecord[];
};

export type CreateStudentRecord = {
  studentName: string;
  studentNumber: string;
};

export type CreateRecordsInput = {
  recordType: RecordType;
  studentRecords: CreateStudentRecord[];
  semester: string;
};

export type CreateRecords = CreateRecordsInput & {
  accessToken: string | null;
};

export type PatchRecordDetail = {
  accessToken: string | null;
  updateStudentRecord: UpdateStudentRecordTypes;
};

export type CreateRecordDetail = {
  recordType: RecordType;
  semester: string;
  studentRecord: StudentRecordTypes;
};

export type CreateRecordDetailRequestTypes = CreateRecordDetail & {
  accessToken: string | null;
};

export type StudentRecordTypes = {
  studentNumber: string;
  studentName: string;
  description: string;
  byteCount: number;
};

export type StudentNameTypes = {
  recordId: number;
  studentName: string;
};

export type SummaryRecordTypes = {
  description: string;
  byteCount: number;
};

export type DeleteRecordDetailTypes = {
  recordId: string;
  accessToken: string | null;
};
