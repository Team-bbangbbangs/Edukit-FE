import { useRef } from 'react';

import { useCreateRecordDetail } from '@/domains/record/hooks/student-manage/use-create-record-detail';
import type { RecordType } from '@/domains/record/types/record';
import { calculateByte } from '@/domains/record/utils/calculate-byte';
import { Input } from '@/shared/components/ui/input/input';
import { Textarea } from '@/shared/components/ui/textarea/textarea';
import { useAutoResizeTextarea } from '@/shared/hooks/use-auto-resize-textarea';

interface RecordDetailAddProps {
  recordType: RecordType;
  onCancel: () => void;
}

export default function RecordDetailAdd({ recordType, onCancel }: RecordDetailAddProps) {
  const { mutate: createRecordDetail } = useCreateRecordDetail();

  const studentNumberRef = useRef<HTMLInputElement>(null);
  const studentNameRef = useRef<HTMLInputElement>(null);
  const { textareaRef, resizeTextarea } = useAutoResizeTextarea('');

  const handleCreate = () => {
    const studentRecord = {
      studentNumber: studentNumberRef.current?.value || '',
      studentName: studentNameRef.current?.value || '',
      description: textareaRef.current?.value || '',
      byteCount: calculateByte(textareaRef.current?.value || ''),
    };

    createRecordDetail({ recordType, studentRecord, semester: '2025-1' }, { onSuccess: onCancel });
  };

  return (
    <tr>
      <td className="py-2 pl-5 align-middle">
        <Input data-testid="student-number-input" ref={studentNumberRef} className="w-full p-1" />
      </td>
      <td className="py-2 pl-5 align-middle">
        <Input data-testid="student-name-input" ref={studentNameRef} className="w-full p-1" />
      </td>
      <td className="py-2 pl-5 align-middle">
        <div className="space-y-3">
          <Textarea
            data-testid="description-textarea"
            ref={textareaRef}
            className="min-h-0 w-full resize-none p-1 text-sm"
            style={{
              lineHeight: 'inherit',
              fontSize: 'inherit',
              overflow: 'hidden',
            }}
            onInput={resizeTextarea}
          />
          <div className="flex justify-end gap-2">
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
          </div>
        </div>
      </td>
    </tr>
  );
}
