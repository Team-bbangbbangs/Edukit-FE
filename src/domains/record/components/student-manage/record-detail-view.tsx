import type { StudentRecord } from '@/domains/record/types/record';

interface RecordDetailViewProps {
  record: StudentRecord;
  onEdit: () => void;
}

export default function RecordDetailView({ record, onEdit }: RecordDetailViewProps) {
  return (
    <tr onClick={onEdit} className="h-12 cursor-pointer transition-colors hover:bg-slate-200">
      <td className="py-3 pl-5">{record.studentNumber}</td>
      <td className="py-3 pl-5">{record.studentName}</td>
      <td className="whitespace-pre-wrap py-3 pl-5">{record.description}</td>
    </tr>
  );
}
