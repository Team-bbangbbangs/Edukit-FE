'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import type { RecordType, PromptResponse } from '@/domains/record/types/record';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/layout/sidebar/base-sidebar';
import { Icons } from '@/shared/components/ui/icon/icon';

import AiResponse from './ai-response';
import CharacteristicInput from './characteristic-input';
import RecordSummary from './record-summary';
import StudentSidebarContent from './student-sidebar-content';

interface StudentRecordWriteProps {
  recordType: RecordType;
  recordId?: string;
}

export default function StudentRecordWrite({ recordType, recordId }: StudentRecordWriteProps) {
  const searchParams = useSearchParams();
  const parsedRecordId = Number(recordId);
  const studentName = searchParams.get('name');

  const [aiResponses, setAiResponses] = useState<PromptResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiResponseGenerated = (responseData: PromptResponse) => {
    setAiResponses(responseData);
    setIsGenerating(false);
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="mb-80 flex w-full flex-col gap-11 p-[60px]">
        <div className="flex w-full justify-between">
          <h2 className="text-heading-24 text-gray-black">학생생활기록부 작성</h2>
          <SidebarTrigger
            className="flex shrink-0 items-center justify-between rounded-[10px] border border-gray-2 px-4 py-[11px]"
            type="button"
          >
            <span
              className={`flex-1 text-body-16-m ${studentName ? 'text-gray-black' : 'text-gray-4'}`}
            >
              {studentName ? decodeURIComponent(studentName) : '학생 선택'}
            </span>
            <Icons.ChevronDown size={20} color="text-gray-4" className="ml-3" />
          </SidebarTrigger>
        </div>

        <div className="flex w-full flex-col items-end gap-[83px]">
          <CharacteristicInput
            selectedId={parsedRecordId}
            onGenerationStart={handleGenerationStart}
            onResponseGenerated={handleAiResponseGenerated}
          />
          <AiResponse recordType={recordType} responses={aiResponses} isGenerating={isGenerating} />
          <RecordSummary selectedId={parsedRecordId} recordType={recordType} />
        </div>
      </div>

      <Sidebar side="right" className="bg-gray-1">
        <SidebarTrigger className="absolute left-2 top-2 z-10 rounded-lg p-[4px] transition-colors hover:bg-gray-2">
          <Icons.SidebarClose size={24} color="text-gray-5" />
        </SidebarTrigger>
        <StudentSidebarContent recordType={recordType} />
      </Sidebar>
    </SidebarProvider>
  );
}
