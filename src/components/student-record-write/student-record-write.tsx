'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import DefaultError from '@/components/error/default-error';
import NotAuthorizedError from '@/components/error/not-authorized-error';
import NotFoundError from '@/components/error/not-found-error';
import NotPermissionError from '@/components/error/not-permission-error';
import Loading from '@/components/loading/loading';
import { useGetStudentsName } from '@/hooks/api/write-record/use-get-students-name';
import type { RecordType, PromptResponse } from '@/types/record/record';

import AiResponse from './ai-response';
import CharacteristicInput from './characteristic-input';
import RecordSummary from './record-summary';

interface StudentRecordWriteProps {
  recordType: RecordType;
  recordId?: string;
}

export default function StudentRecordWrite({ recordType, recordId }: StudentRecordWriteProps) {
  const { data, isPending, isError, isNotFound, isUnauthorized, isNotPermission } =
    useGetStudentsName(recordType, '2025-1');
  const router = useRouter();
  const parsedRecordId = Number(recordId);

  const [aiResponses, setAiResponses] = useState<PromptResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!recordId && data && data.studentDetails.length > 0) {
      router.replace(`?recordId=${data.studentDetails[0].recordId}`);
    }
  }, [data, recordId, router]);

  const handleAiResponseGenerated = (responseData: PromptResponse) => {
    setAiResponses(responseData);
    setIsGenerating(false);
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
  };

  if (isPending) {
    return <Loading />;
  }

  if (isNotFound) {
    return <NotFoundError recordType={recordType} />;
  }

  if (isUnauthorized) {
    return <NotAuthorizedError />;
  }

  if (isNotPermission) {
    return <NotPermissionError />;
  }

  if (isError) {
    return <DefaultError />;
  }

  if (data && data.studentDetails.length === 0) {
    return <NotFoundError recordType={recordType} />;
  }

  return (
    <div className="flex flex-col gap-10">
      <CharacteristicInput
        students={data.studentDetails}
        selectedId={parsedRecordId}
        onGenerationStart={handleGenerationStart}
        onResponseGenerated={handleAiResponseGenerated}
      />
      <AiResponse recordType={recordType} responses={aiResponses} isGenerating={isGenerating} />
      <hr className="h-[1px] border-0 bg-black" />
      <RecordSummary selectedId={parsedRecordId} recordType={recordType} />
    </div>
  );
}
