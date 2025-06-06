import type { StudentRecord } from '@/types/api/student-record';

interface RecordDetailViewProps {
  record: StudentRecord;
  onEdit: () => void;
}

export default function RecordDetailView({ record, onEdit }: RecordDetailViewProps) {
  return (
    <tr onClick={onEdit} className="cursor-pointer transition-colors hover:bg-slate-200">
      <td className="py-2 pl-5">{record.studentNumber}</td>
      <td className="py-2 pl-5">{record.name}</td>
      <td className="py-2 pl-5">{record.content}</td>
    </tr>
  );
}
