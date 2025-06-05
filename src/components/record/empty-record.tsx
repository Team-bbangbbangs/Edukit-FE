'use client';

import { useState } from 'react';

import type { RecordType } from '@/types/api/student-record';

import CreateRecordModal from '../modal/create-record-modal';

export default function EmptyRecord({ recordType }: { recordType: RecordType }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <p className="text-[20px] font-bold">아직 등록된 생활기록부가 없어요</p>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-800 px-10 py-4 text-[20px] font-bold text-white hover:bg-slate-950"
      >
        학생 등록하고
        <br /> 생활기록부 관리하기
      </button>

      <CreateRecordModal open={open} onOpenChange={setOpen} recordType={recordType} />
    </>
  );
}
