import { useRef } from 'react';

import { Textarea } from '@/components/textarea/textarea';
import type { RecordType } from '@/types/api/student-record';

export default function RecordSummary({ recordType }: { recordType: RecordType }) {
  const recordSummaryTextRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="relative flex flex-col gap-4">
      <h4 className="font-bold">종합</h4>
      <Textarea
        ref={recordSummaryTextRef}
        placeholder="완성본을 적어주세요."
        className="h-60 border-slate-400 p-5 placeholder:text-slate-400"
      />
      <div className="flex justify-end">
        <button className="hover:slate-950 justify-end rounded-md bg-slate-800 px-4 pb-1.5 pt-2 text-white">
          저장
        </button>
      </div>
      <span className="absolute bottom-14 right-2 text-slate-400">1000/1500</span>
    </div>
  );
}
