'use client';

import type { RecordType } from '@/types/api/student-record';

import AiResponse from './ai-response';
import CharacteristicInput from './characteristic-input';
import RecordSummary from './record-summary';

export default function StudentRecordWrite({ recordType }: { recordType: RecordType }) {
  return (
    <div className="flex flex-col gap-10">
      <CharacteristicInput recordType={recordType} />
      <AiResponse recordType={recordType} />
      <hr className="h-[1px] border-0 bg-black" />
      <RecordSummary recordType={recordType} />
    </div>
  );
}
