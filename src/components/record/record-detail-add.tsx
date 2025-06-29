import { useRef } from 'react';

import { Input } from '@/components/input/input';
import { useCreateRecordDetail } from '@/hooks/api/use-create-record-detail';
import type { RecordType } from '@/types/api/student-record';
import { calculateByte } from '@/util/calculate-byte';

interface RecordDetailAddProps {
  recordType: RecordType;
  onCancel: () => void;
}

export default function RecordDetailAdd({ recordType, onCancel }: RecordDetailAddProps) {
  const { mutate: createRecordDetail } = useCreateRecordDetail();

  const studentNumberRef = useRef<HTMLInputElement>(null);
  const studentNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    const studentRecord = {
      studentNumber: studentNumberRef.current?.value || '',
      studentName: studentNameRef.current?.value || '',
      description: descriptionRef.current?.value || '',
      byteCount: calculateByte(descriptionRef.current?.value || ''),
    };

    createRecordDetail({ recordType, studentRecord, semester: '2025-1' }, { onSuccess: onCancel });
  };

  return (
    <tr className="relative">
      <td className="py-2 pl-5">
        <Input ref={studentNumberRef} className="w-full p-1" />
      </td>
      <td className="py-2 pl-5">
        <Input ref={studentNameRef} className="w-full p-1" />
      </td>
      <td className="py-2 pl-5">
        <Input ref={descriptionRef} className="w-full p-1" />
      </td>
      <td className="absolute right-0 top-14 flex gap-2">
        <button
          className="rounded-md bg-slate-800 px-4 pb-1.5 pt-2 text-white hover:bg-slate-950"
          onClick={onCancel}
        >
          취소하기
        </button>
        <button
          className="rounded-md bg-slate-800 px-4 pb-1.5 pt-2 text-white hover:bg-slate-950"
          onClick={handleCreate}
        >
          추가하기
        </button>
      </td>
    </tr>
  );
}
