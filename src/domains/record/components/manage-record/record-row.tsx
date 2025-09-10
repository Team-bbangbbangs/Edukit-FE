import type { Records } from '@/domains/record/types/record';
import { calculateByte } from '@/domains/record/utils/calculate-byte';

interface RecordRowProps {
  record: Records;
  forwardRef?: React.Ref<HTMLDivElement>;
}

export default function RecordRow({ record, forwardRef }: RecordRowProps) {
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
        <p className="text-body-16-m text-gray-black">{record.description}</p>
        <div className="flex w-full items-center justify-end gap-[2px]">
          <span className="text-body-16-r text-gray-4">{calculateByte(record.description)}</span>
          <span className="text-body-16-r text-gray-4">Bytes</span>
        </div>
      </div>
    </div>
  );
}
