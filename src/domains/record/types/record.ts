export type RecordType = 'SUBJECT' | 'BEHAVIOR' | 'CAREER' | 'FREE' | 'CLUB';

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

export interface InvalidRows {
  rowNumber: number;
  grade: number;
  classNumber: number;
  studentNumber: number;
  studentName: string;
}

export interface ExcelUploadResponse {
  successCount: number;
  failureCount: number;
  invalidRows: InvalidRows[];
}

export interface Student {
  studentId: number;
  grade: number;
  classNumber: number;
  studentNumber: number;
  studentName: string;
  recordTypes: RecordType[];
}

export interface CreateStudentRequest {
  grade: number;
  classNumber: number;
  studentNumber: number;
  studentName: string;
  recordTypes: RecordType[];
}
export interface StudentsResponse {
  studentCount: number;
  grades: number[];
  classNumbers: number[];
  students: Student[];
}

export interface StudentFilters {
  grades?: number[];
  classNumbers?: number[];
  recordTypes?: RecordType[];
}

export interface GetStudentsParams extends StudentFilters {
  lastStudentId?: number;
  pageSize?: number;
}
