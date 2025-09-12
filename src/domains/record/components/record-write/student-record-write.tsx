'use client';

import { useState } from 'react';

import { RECORD_TYPE_TITLES } from '@/domains/record/constants/record-type';
import type { RecordType } from '@/domains/record/types/record';
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
  recordId?: number;
  studentName?: string;
}

export default function StudentRecordWrite({
  recordType,
  recordId,
  studentName,
}: StudentRecordWriteProps) {
  const [taskId, setTaskId] = useState<string | null>(null);
  const isValidRecordId = recordId && !isNaN(recordId);

  const [isGenerating, setIsGenerating] = useState(false);
  const [bytesLimit, setBytesLimit] = useState(recordType === 'career' ? 2100 : 1500);

  const handleTaskIdReceived = (newTaskId: string) => {
    setTaskId(newTaskId);
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="mb-40 flex w-full flex-col gap-11 p-[60px]">
        <div className="flex w-full justify-between">
          <h2 className="text-heading-24 text-gray-black">{RECORD_TYPE_TITLES[recordType]}</h2>
          <SidebarTrigger
            className="flex shrink-0 items-center justify-between rounded-[10px] border border-gray-2 px-4 py-[11px]"
            type="button"
          >
            <span
              className={`flex-1 text-body-16-m ${studentName ? 'text-gray-black' : 'text-gray-4'}`}
            >
              {studentName ?? '학생 선택'}
            </span>
            <Icons.ChevronDown size={20} color="text-gray-4" className="ml-3" />
          </SidebarTrigger>
        </div>

        <div className="flex w-full flex-col items-end gap-[83px]">
          <CharacteristicInput
            selectedId={recordId}
            bytesLimit={bytesLimit}
            isGenerating={isGenerating}
            onBytesLimitChange={setBytesLimit}
            onGenerationStart={handleGenerationStart}
            onTaskIdReceived={handleTaskIdReceived}
          />
          {isValidRecordId ? (
            <>
              <AiResponse
                selectedId={recordId}
                taskId={taskId}
                isGenerating={isGenerating}
                bytesLimit={bytesLimit}
                onGenerationComplete={handleGenerationComplete}
              />
              <RecordSummary
                selectedId={recordId}
                recordType={recordType}
                bytesLimit={bytesLimit}
              />
            </>
          ) : null}
        </div>
      </div>

      <Sidebar side="right" className="bg-gray-1">
        <SidebarTrigger className="absolute left-2 top-2 z-10 rounded-lg p-[4px] transition-colors hover:bg-gray-2">
          <Icons.SidebarClose size={24} color="text-gray-5" />
        </SidebarTrigger>
        <StudentSidebarContent recordType={recordType} currentRecordId={recordId} />
      </Sidebar>
    </SidebarProvider>
  );
}
