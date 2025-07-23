'use client';

import { useRef, useState } from 'react';

import { useDeleteRecordDetail } from '@/domains/record/apis/mutations/use-delete-record-detail';
import { usePatchRecordDetail } from '@/domains/record/apis/mutations/use-patch-record-detail';
import type {
  RecordType,
  StudentRecord,
  StudentRecordRequest,
} from '@/domains/record/types/record';
import { calculateByte } from '@/domains/record/utils/calculate-byte';
import { Input } from '@/shared/components/ui/input/input';
import DeleteConfirmModal from '@/shared/components/ui/modal/delete-confirm-modal';
import { Textarea } from '@/shared/components/ui/textarea/textarea';
import { useAutoResizeTextarea } from '@/shared/hooks/use-auto-resize-textarea';

interface RecordDetailEditProps {
  record: StudentRecord;
  recordType: RecordType;
  onView: () => void;
}

export default function RecordDetailEdit({ record, recordType, onView }: RecordDetailEditProps) {
  const { mutate: patchRecordDetail } = usePatchRecordDetail();
  const { mutate: deleteRecordDetail } = useDeleteRecordDetail();

  const studentNumberRef = useRef<HTMLInputElement>(null);
  const studentNameRef = useRef<HTMLInputElement>(null);
  const { textareaRef, resizeTextarea } = useAutoResizeTextarea(record.description);

  const [open, setOpen] = useState(false);

  const handleSave = () => {
    const updatedStudentNumber = studentNumberRef.current?.value || '';
    const updatedName = studentNameRef.current?.value || '';
    const updatedDescription = textareaRef.current?.value || '';
    const updatedByteCount = calculateByte(updatedDescription);

    const updateStudentRecord: StudentRecordRequest = {
      ...record,
      studentNumber: updatedStudentNumber,
      studentName: updatedName,
      description: updatedDescription,
      byteCount: updatedByteCount,
    };

    patchRecordDetail({ recordType, updateStudentRecord }, { onSuccess: onView });
  };

  const handleOpenDeleteModal = () => {
    setOpen(true);
  };

  const handleDelete = () => {
    deleteRecordDetail({ recordType, recordId: record.recordDetailId });
  };

  return (
    <>
      <tr>
        <td className="py-2 pl-5 align-middle">
          <Input
            data-testid="student-number-input"
            defaultValue={record.studentNumber}
            ref={studentNumberRef}
            className="w-full p-1"
          />
        </td>
        <td className="py-2 pl-5 align-middle">
          <Input
            data-testid="student-name-input"
            defaultValue={record.studentName}
            ref={studentNameRef}
            className="w-full p-1"
          />
        </td>
        <td className="py-2 pl-5 align-middle">
          <div className="space-y-3">
            <Textarea
              data-testid="description-textarea"
              ref={textareaRef}
              defaultValue={record.description}
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
                onClick={handleOpenDeleteModal}
              >
                삭제하기
              </button>
            </div>
          </div>
        </td>
      </tr>
      <DeleteConfirmModal open={open} onOpenChange={setOpen} onDelete={handleDelete} />
    </>
  );
}
