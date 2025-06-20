import type { StudentRecord } from '@/types/api/student-record';

interface RecordDetailViewProps {
  record: StudentRecord;
  onEdit: () => void;
}

export default function RecordDetailView({ record, onEdit }: RecordDetailViewProps) {
  return (
    <tr onClick={onEdit} className="h-12 cursor-pointer transition-colors hover:bg-slate-200">
      <td className="pl-5">{record.studentNumber}</td>
      <td className="pl-5">{record.studentName}</td>
      <td className="pl-5">{record.content}</td>
    </tr>
  );
}
