export type RecordType = 'subject' | 'behavior' | 'career' | 'free' | 'club';

export type StudentRecord = {
  id: string;
  studentNumber: string;
  name: string;
  content: string;
};

export type CreateStudentRecord = {
  name: string;
  studentNumber: string;
};

export type CreateRecord = {
  recordType: RecordType;
  students: CreateStudentRecord[];
};

export type PutRecordDetail = {
  recordType: RecordType;
  detailRecord: StudentRecord;
};
