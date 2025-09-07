'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useGetStudentsName } from '@/domains/record/apis/queries/use-get-students-name';
import type { RecordType, StudentsNamesFilters } from '@/domains/record/types/record';
import Dropdown from '@/shared/components/ui/dropdown/dropdown';
import { Icons } from '@/shared/components/ui/icon/icon';
import { Input } from '@/shared/components/ui/input/input';
import { cn } from '@/shared/lib/utils';

interface StudentSidebarContentProps {
  recordType: RecordType;
  currentRecordId?: number;
}

export default function StudentSidebarContent({
  recordType,
  currentRecordId,
}: StudentSidebarContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | undefined>();
  const [selectedClassNumber, setSelectedClassNumber] = useState<number | undefined>();

  const filters: StudentsNamesFilters = {
    ...(selectedGrade && { grade: selectedGrade }),
    ...(selectedClassNumber && { classNumber: selectedClassNumber }),
    ...(searchTerm && { studentName: searchTerm }),
  };

  const { data: studentsData, isLoading, isError } = useGetStudentsName(recordType, filters);

  const handleStudentClick = (recordId: number, studentName: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('id', recordId.toString());
    params.set('name', encodeURIComponent(studentName));
    router.push(`?${params.toString()}`);
  };

  const handleGradeSelect = (grade: number) => {
    setSelectedGrade(grade);
    setSelectedClassNumber(undefined);
  };

  const handleClassSelect = (classNumber: number) => {
    setSelectedClassNumber(classNumber);
  };

  const resetFilters = () => {
    setSelectedGrade(undefined);
    setSelectedClassNumber(undefined);
    setSearchTerm('');
  };

  const isStudentActive = (recordId: number) => {
    return currentRecordId === recordId;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex flex-shrink-0 flex-col items-start gap-4 self-stretch px-4">
        <div className="flex items-center gap-4 self-stretch">
          <Dropdown className="flex flex-1">
            <Dropdown.Trigger
              className="flex flex-1 items-center justify-between rounded-[10px] border border-gray-2 px-4 py-[11px] text-body-16-m text-gray-black"
              iconPosition="right"
            >
              {selectedGrade ? `${selectedGrade}학년` : '학년 선택'}
            </Dropdown.Trigger>
            <Dropdown.Content className="max-h-40 overflow-y-auto rounded-[10px]">
              <Dropdown.Item onClick={resetFilters} index={0} className="px-4 py-[11px]">
                전체
              </Dropdown.Item>
              {studentsData?.grades.map((grade, index) => (
                <Dropdown.Item
                  key={grade}
                  onClick={() => handleGradeSelect(grade)}
                  selected={selectedGrade === grade}
                  index={index + 1}
                  className="px-4 py-[11px]"
                >
                  {grade}학년
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>

          <Dropdown className="flex flex-1 items-center justify-between">
            <Dropdown.Trigger
              className="flex flex-1 items-center justify-between rounded-[10px] border border-gray-2 px-4 py-[11px] text-body-16-m text-gray-black"
              iconPosition="right"
            >
              {selectedClassNumber ? `${selectedClassNumber}반` : '반 선택'}
            </Dropdown.Trigger>
            <Dropdown.Content className="max-h-40 overflow-y-auto rounded-[10px]">
              <Dropdown.Item
                onClick={() => setSelectedClassNumber(undefined)}
                index={0}
                className="px-4 py-[11px]"
              >
                전체
              </Dropdown.Item>
              {studentsData?.classNumbers.map((classNumber, index) => (
                <Dropdown.Item
                  key={classNumber}
                  onClick={() => handleClassSelect(classNumber)}
                  selected={selectedClassNumber === classNumber}
                  index={index + 1}
                  className="px-4 py-[11px]"
                >
                  {classNumber}반
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </div>

        <div className="relative w-full">
          <Input
            type="text"
            placeholder="학생 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isError}
            className="h-[48px] rounded-[10px] border border-gray-2 py-[11px] pl-4 pr-10"
          />
          <Icons.Search
            size={20}
            color="text-gray-4"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-40">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-label-18 text-gray-4">로딩 중...</div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center p-8 text-label-18 text-red-500">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : studentsData?.studentNames?.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-label-18 text-gray-4">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="space-y-1 pb-4">
            {studentsData?.studentNames?.map((student, index) => (
              <button
                key={student.recordId}
                onClick={() => handleStudentClick(student.recordId, student.studentName)}
                className={cn(
                  'w-full cursor-pointer rounded-lg px-5 py-3 text-left text-label-18 transition-colors duration-200 hover:bg-gray-2',
                  isStudentActive(student.recordId) && 'bg-gray-2',
                )}
              >
                <span className="text-label-18 text-gray-black">
                  {`${index + 1}. ${student.studentName}`}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
