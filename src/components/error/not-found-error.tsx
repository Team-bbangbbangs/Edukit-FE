'use client';

import { useState } from 'react';

import CreateRecordModal from '@/components/modal/create-record-modal';
import ExcelUploadModal from '@/components/modal/excel-upload-modal';
import type { RecordType } from '@/types/api/student-record';

export default function NotFoundError({ recordType }: { recordType: RecordType }) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="text-[20px] font-bold">아직 등록된 생활기록부가 없어요</p>
      <button
        onClick={() => setCreateModalOpen(true)}
        className="h-24 w-60 rounded-lg bg-slate-800 text-[20px] font-bold text-white hover:bg-slate-950"
      >
        학생 등록하고
        <br /> 생활기록부 관리하기
      </button>
      <button
        onClick={() => setExcelModalOpen(true)}
        className="h-24 w-60 rounded-lg bg-green-600 text-[20px] font-bold text-white hover:bg-green-500"
      >
        엑셀 업로드하고
        <br /> 생활기록부 관리하기
      </button>

      <CreateRecordModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        recordType={recordType}
      />
      <ExcelUploadModal
        open={excelModalOpen}
        onOpenChange={setExcelModalOpen}
        recordType={recordType}
      />
    </div>
  );
}
