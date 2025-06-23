'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import EmptyRecord from '@/components/record/empty-record';
import { useGetStudentsName } from '@/hooks/api/use-get-students-name';
import type { RecordType, AiResponseData } from '@/types/api/student-record';

import AiResponse from './ai-response';
import CharacteristicInput from './characteristic-input';
import RecordSummary from './record-summary';

interface StudentRecordWriteProps {
  recordType: RecordType;
  recordId?: string;
}

export default function StudentRecordWrite({ recordType, recordId }: StudentRecordWriteProps) {
  const { data, isPending, isError, isNotFound, isUnauthorized } = useGetStudentsName(
    recordType,
    '2025-1',
  );
  const router = useRouter();
  const parsedRecordId = Number(recordId);

  const [aiResponses, setAiResponses] = useState<AiResponseData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!recordId && data && data.length > 0) {
      router.replace(`?recordId=${data[0].recordId}`);
    }
  }, [data, recordId, router]);

  const handleAiResponseGenerated = (responseData: AiResponseData) => {
    setAiResponses(responseData);
    setIsGenerating(false);
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
  };

  if (isPending) {
    return <div>로딩중입니다.</div>;
  }

  if (isNotFound) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <EmptyRecord recordType={recordType} />
      </div>
    );
  }

  if (isUnauthorized) {
    return <div>로그인해주세요.</div>;
  }

  if (isError) {
    return <div>에러입니다.</div>;
  }

  if (data && data.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <EmptyRecord recordType={recordType} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <CharacteristicInput
        students={data}
        selectedId={parsedRecordId}
        onGenerationStart={handleGenerationStart}
        onResponseGenerated={handleAiResponseGenerated}
      />
      <AiResponse selectedId={parsedRecordId} responses={aiResponses} isGenerating={isGenerating} />
      <hr className="h-[1px] border-0 bg-black" />
      <RecordSummary selectedId={parsedRecordId} />
    </div>
  );
}
