export type RecordType = 'subject' | 'behavior' | 'career' | 'free' | 'club';

export type StudentRecord = {
  recordDetailId: string;
  studentNumber: string;
  studentName: string;
  content: string;
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

export type PutRecordDetail = {
  recordType: RecordType;
  detailRecord: StudentRecord;
};

export type CreateRecordDetail = {
  recordType: RecordType;
  studentNumber: string;
  studentName: string;
  content: string;
};

export type StudentNameTypes = {
  recordId: number;
  studentName: string;
};

export type SummaryRecordTypes = {
  description: string;
  byteCount: number;
};
