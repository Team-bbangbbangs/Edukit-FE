'use client';

import { useState } from 'react';

import ExcelUploadModal from '@/components/modal/excel-upload-modal';
import type { RecordType } from '@/types/api/student-record';

export default function NotFoundError({ recordType }: { recordType: RecordType }) {
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="text-[20px] font-bold">아직 등록된 생활기록부가 없어요</p>
      <button
        onClick={() => setExcelModalOpen(true)}
        className="h-24 w-60 rounded-lg bg-slate-800 text-[20px] font-bold text-white hover:bg-slate-950"
      >
        학생 등록하고
        <br /> 생활기록부 관리하기
      </button>

      <ExcelUploadModal
        open={excelModalOpen}
        onOpenChange={setExcelModalOpen}
        recordType={recordType}
      />
    </div>
  );
}
