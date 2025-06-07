import { useRef } from 'react';

import { Textarea } from '@/components/textarea/textarea';
import type { RecordType } from '@/types/api/student-record';

export default function CharacteristicInput({ recordType }: { recordType: RecordType }) {
  const characteristicInputTextRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-[24px] font-bold">학생 특성 기입란</h2>
        <button className="hover:slate-950 flex gap-2 rounded-md bg-slate-800 px-6 pb-1.5 pt-2 text-white">
          <span>학생 1</span>
          <span>-</span>
        </button>
      </div>
      <Textarea
        ref={characteristicInputTextRef}
        placeholder="내용을 입력해주세요."
        className="h-60 border-slate-400 p-5 placeholder:text-slate-400"
      />
      <div className="flex justify-end">
        <button className="hover:slate-950 w-auto rounded-md bg-slate-800 px-4 pb-1.5 pt-2 text-white">
          생성
        </button>
      </div>
    </div>
  );
}
