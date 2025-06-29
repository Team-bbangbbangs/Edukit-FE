'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { Input } from '@/components/input/input';
import DeleteConfirmModal from '@/components/modal/delete-confirm-modal';
import { Textarea } from '@/components/textarea/textarea';
import { useDeleteRecordDetail } from '@/hooks/api/use-delete-record-detail';
import { usePatchRecordDetail } from '@/hooks/api/use-patch-record-detail';
import type {
  RecordType,
  StudentRecord,
  UpdateStudentRecordTypes,
} from '@/types/api/student-record';
import { calculateByte } from '@/util/calculate-byte';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [open, setOpen] = useState(false);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleSave = () => {
    const updatedStudentNumber = studentNumberRef.current?.value || '';
    const updatedName = studentNameRef.current?.value || '';
    const updatedDescription = textareaRef.current?.value || '';
    const updatedByteCount = calculateByte(updatedDescription);

    const updateStudentRecord: UpdateStudentRecordTypes = {
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

  useLayoutEffect(() => {
    resizeTextarea();
  }, [record.description]);

  return (
    <>
      <tr>
        <td className="py-2 pl-5 align-middle">
          <Input
            defaultValue={record.studentNumber}
            ref={studentNumberRef}
            className="w-full p-1"
          />
        </td>
        <td className="py-2 pl-5 align-middle">
          <Input defaultValue={record.studentName} ref={studentNameRef} className="w-full p-1" />
        </td>
        <td className="py-2 pl-5 align-middle">
          <div className="space-y-3">
            <Textarea
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
