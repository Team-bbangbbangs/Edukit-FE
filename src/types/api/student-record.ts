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

export type CreateRecords = {
  recordType: RecordType;
  studentRecords: CreateStudentRecord[];
  semester: string;
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

export type studentDetails = {
  studentDetails: StudentNameTypes[];
};

export type SummaryRecordTypes = {
  description: string;
  byteCount: number;
};

export type DeleteRecordDetailTypes = {
  recordId: string;
  accessToken: string | null;
};

export type PostPrompt = {
  recordId: number;
  prompt: string;
};

export interface AiResponseData {
  description1: string;
  description2: string;
  description3: string;
}
