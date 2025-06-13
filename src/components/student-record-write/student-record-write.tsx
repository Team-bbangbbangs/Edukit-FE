'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import EmptyRecord from '@/components/record/empty-record';
import { useGetStudentsName } from '@/hooks/api/use-get-students-name';
import type { RecordType } from '@/types/api/student-record';

import AiResponse from './ai-response';
import CharacteristicInput from './characteristic-input';
import RecordSummary from './record-summary';

export default function StudentRecordWrite({ recordType }: { recordType: RecordType }) {
  const { data, isPending, isError } = useGetStudentsName(recordType, '2025-1');
  const router = useRouter();
  const searchParams = useSearchParams();
  const recordId = searchParams.get('recordId');

  useEffect(() => {
    if (!recordId && data && data.length > 0) {
      router.replace(`?recordId=${data[0].recordId}`);
    }
  }, [data, recordId, router]);

  if (isError) {
    return <div>에러입니다.</div>;
  }
  if (isPending) {
    return <div>로딩중입니다.</div>;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <EmptyRecord recordType={recordType} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <CharacteristicInput recordType={recordType} students={data} selectedId={Number(recordId)} />
      <AiResponse recordType={recordType} />
      <hr className="h-[1px] border-0 bg-black" />
      <RecordSummary selectedId={Number(recordId)} />
    </div>
  );
}
