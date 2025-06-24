'use client';

import { useState } from 'react';

import CreateRecordModal from '@/components/modal/create-record-modal';
import type { RecordType } from '@/types/api/student-record';

export default function NotFoundError({ recordType }: { recordType: RecordType }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="text-[20px] font-bold">아직 등록된 생활기록부가 없어요</p>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-800 px-10 py-4 text-[20px] font-bold text-white hover:bg-slate-950"
      >
        학생 등록하고
        <br /> 생활기록부 관리하기
      </button>

      <CreateRecordModal open={open} onOpenChange={setOpen} recordType={recordType} />
    </div>
  );
}
