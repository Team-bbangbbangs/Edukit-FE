import type { Ref } from 'react';
import { useState } from 'react';

import { usePostRecordDetail } from '@/domains/record/apis/mutations/use-post-record-detail';
import type { Records } from '@/domains/record/types/record';
import { calculateByte } from '@/domains/record/utils/calculate-byte';
import { useAutoResizeTextarea } from '@/shared/hooks/use-auto-resize-textarea';

interface RecordRowProps {
  record: Records;
  forwardRef?: Ref<HTMLDivElement>;
  isEditing: boolean;
  onEditingChange: (recordId: number | null) => void;
}

export default function RecordRow({
  record,
  forwardRef,
  isEditing,
  onEditingChange,
}: RecordRowProps) {
  const [description, setDescription] = useState(record.description);
  const { textareaRef, resizeTextarea } = useAutoResizeTextarea(description, 100);
  const { mutate: updateRecord } = usePostRecordDetail();

  const handleDescriptionClick = () => {
    if (!isEditing) {
      onEditingChange(record.recordId);
    }
  };

  const handleSave = () => {
    if (description !== record.description) {
      updateRecord({
        recordId: record.recordId,
        description: description,
      });
    }
    onEditingChange(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setDescription(record.description);
      onEditingChange(null);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div ref={forwardRef} className="flex items-center self-stretch border-b border-gray-2">
      <div className="flex w-[100px] items-center justify-center self-stretch border-r border-gray-2 px-9 py-4">
        <span className="truncate text-body-16-m text-gray-4">{record.grade}</span>
      </div>
      <div className="flex w-[100px] items-center justify-center self-stretch border-r border-gray-2 px-9 py-4">
        <span className="truncate text-body-16-m text-gray-4">{record.classNumber}</span>
      </div>
      <div className="flex w-[200px] items-center justify-center self-stretch border-r border-gray-2 px-9 py-4">
        <span className="truncate text-body-16-m text-gray-4">{record.studentNumber}</span>
      </div>
      <div className="flex w-[140px] items-center justify-center self-stretch border-r border-gray-2 px-9 py-4">
        <span className="truncate text-body-16-m text-gray-4">{record.studentName}</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-[10px] self-stretch px-10 py-4">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onInput={resizeTextarea}
            className="min-h-[100px] w-full resize-none rounded-[10px] border border-gray-5 bg-transparent p-2 text-body-16-m text-gray-black outline-none"
            autoFocus
          />
        ) : (
          <p
            className="flex min-h-[100px] w-full cursor-pointer self-stretch p-2 text-body-16-m text-gray-black"
            onClick={handleDescriptionClick}
          >
            {description}
          </p>
        )}
        <div className="flex w-full items-center justify-end gap-[2px]">
          <span className="text-body-16-r text-gray-4">{calculateByte(description)}</span>
          <span className="text-body-16-r text-gray-4">Bytes</span>
        </div>
      </div>
    </div>
  );
}
