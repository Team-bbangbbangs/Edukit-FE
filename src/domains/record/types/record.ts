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
  grades: number[];
  classNumbers: number[];
  studentNames: StudentNames[];
}

export interface StudentsNamesFilters {
  grade?: number;
  classNumber?: number;
  studentName?: string;
}

export interface SummaryRecordRequest {
  recordId: number;
  description: string;
  byteCount: number;
}

export interface SummaryRecordResponse {
  description: string;
}

export interface PromptRequest {
  recordId: number;
  prompt: string;
  byteCount: number;
}

export interface AiGenerateRequest {
  byteCount: number;
  prompt: string;
}

export interface AiGenerateResponse {
  taskId: string;
}

export type SseMessageType = 'PROGRESS' | 'RESPONSE';

export interface SseMessage {
  taskId: string;
  type: SseMessageType;
  data: {
    message?: string;
    finalContent?: string;
    version?: number;
  };
}

export interface StreamingResponse {
  taskId: string;
  progressMessages: string[];
  versions: {
    version: number;
    content: string;
  }[];
  isComplete: boolean;
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
