export type RecordType = 'subject' | 'behavior' | 'career' | 'free' | 'club';

export interface StudentRecord {
  recordDetailId: string;
  studentNumber: string;
  studentName: string;
  description: string;
}

export interface StudentRecordRequest extends StudentRecord {
  byteCount: number;
}

export interface StudentRecordsResponse {
  students: StudentRecord[];
}

export interface CreateStudentRecords {
  studentName: string;
  studentNumber: string;
}

export interface CreateStudentRecordsRequest {
  recordType: RecordType;
  studentRecords: CreateStudentRecords[];
  semester: string;
}

interface CreateStudentRecord extends CreateStudentRecords {
  description: string;
  byteCount: number;
}

export interface CreateStudentRecordRequest {
  recordType: RecordType;
  semester: string;
  studentRecord: CreateStudentRecord;
}

export interface StudentNames {
  recordId: number;
  studentName: string;
}

export interface StudentNamesResponse {
  studentDetails: StudentNames[];
}

export interface SummaryRecordRequest {
  recordId: number;
  description: string;
  byteCount: number;
}

export interface SummaryRecordResponse {
  description: string;
  byteCount: number;
}

export interface PromptRequest {
  recordId: number;
  prompt: string;
}

export interface PromptResponse {
  description1: string;
  description2: string;
  description3: string;
}
