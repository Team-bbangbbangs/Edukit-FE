import { useState } from 'react';

import type { RecordType, StudentRecord } from '@/types/api/student-record';

import RecordDetailEdit from './record-detail-edit';
import RecordDetailView from './record-detail-view';

interface RecordDetailRowProps {
  record: StudentRecord;
  recordType: RecordType;
}

export default function RecordDetailRow({ record, recordType }: RecordDetailRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <RecordDetailEdit record={record} recordType={recordType} onView={() => setIsEditing(false)} />
  ) : (
    <RecordDetailView record={record} onEdit={() => setIsEditing(true)} />
  );
}
