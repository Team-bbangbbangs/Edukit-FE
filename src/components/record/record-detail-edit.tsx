import { useRef } from 'react';

import { Input } from '@/components/input/input';
import { useDeleteRecordDetail } from '@/hooks/api/use-delete-record-detail';
import { usePutRecordDetail } from '@/hooks/api/use-put-record-detail';
import type { RecordType, StudentRecord } from '@/types/api/student-record';

interface RecordDetailEditProps {
  record: StudentRecord;
  recordType: RecordType;
  onView: () => void;
}

export default function RecordDetailEdit({ record, recordType, onView }: RecordDetailEditProps) {
  const { mutate: putRecordDetail } = usePutRecordDetail();

  const { mutate: deleteRecordDetail } = useDeleteRecordDetail();

  const studentNumberRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const updatedStudentNumber = studentNumberRef.current?.value || '';
    const updatedName = nameRef.current?.value || '';
    const updatedContent = contentRef.current?.value || '';

    const detailRecord: StudentRecord = {
      ...record,
      studentNumber: updatedStudentNumber,
      name: updatedName,
      content: updatedContent,
    };

    putRecordDetail({ recordType, detailRecord }, { onSuccess: onView });
  };

  const handleDelete = () => {
    deleteRecordDetail(record.id);
  };

  return (
    <tr className="relative">
      <td className="py-2 pl-5">
        <Input defaultValue={record.studentNumber} ref={studentNumberRef} className="w-full p-1" />
      </td>
      <td className="py-2 pl-5">
        <Input defaultValue={record.name} ref={nameRef} className="w-full p-1" />
      </td>
      <td className="py-2 pl-5">
        <Input defaultValue={record.content} ref={contentRef} className="w-full p-1" />
      </td>
      <td className="absolute right-0 top-14 flex gap-2">
        <button
          className="rounded-md bg-slate-800 px-4 pb-1.5 pt-2 text-white hover:bg-slate-950"
          onClick={onView}
        >
          취소하기
        </button>
        <button
          className="rounded-md bg-slate-800 px-4 pb-1.5 pt-2 text-white hover:bg-slate-950"
          onClick={handleSave}
        >
          수정하기
        </button>
        <button
          className="rounded-md bg-red-600 px-4 pb-1.5 pt-2 text-white hover:bg-red-700"
          onClick={handleDelete}
        >
          삭제하기
        </button>
      </td>
    </tr>
  );
}
