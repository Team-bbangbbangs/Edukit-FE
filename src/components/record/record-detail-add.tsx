import { useRef } from 'react';

import { Input } from '@/components/input/input';
import { useCreateRecordDetail } from '@/hooks/api/use-create-record-detail';
import type { RecordType } from '@/types/api/student-record';

interface RecordDetailAddProps {
  recordType: RecordType;
  onCancel: () => void;
}

export default function RecordDetailAdd({ recordType, onCancel }: RecordDetailAddProps) {
  const { mutate: createRecordDetail } = useCreateRecordDetail();

  const studentNumberRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    const studentNumber = studentNumberRef.current?.value || '';
    const name = nameRef.current?.value || '';
    const content = contentRef.current?.value || '';

    createRecordDetail({ recordType, studentNumber, name, content }, { onSuccess: onCancel });
  };

  return (
    <tr className="relative">
      <td className="py-2 pl-5">
        <Input ref={studentNumberRef} className="w-full p-1" />
      </td>
      <td className="py-2 pl-5">
        <Input ref={nameRef} className="w-full p-1" />
      </td>
      <td className="py-2 pl-5">
        <Input ref={contentRef} className="w-full p-1" />
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
