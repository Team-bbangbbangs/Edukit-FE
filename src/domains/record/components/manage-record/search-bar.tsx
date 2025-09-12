'use client';

import { useState } from 'react';

import type { RecordsFilters, RecordType } from '@/domains/record/types/record';
import Dropdown from '@/shared/components/ui/dropdown/dropdown';
import { Icons } from '@/shared/components/ui/icon/icon';
import { Input } from '@/shared/components/ui/input/input';

interface SearchBarProps {
  recordType: RecordType;
  grades?: number[];
  classNumbers?: number[];
  onFiltersChange: (filters: RecordsFilters) => void;
  disabled?: boolean;
}

export default function SearchBar({
  recordType,
  grades,
  classNumbers,
  onFiltersChange,
  disabled = false,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | undefined>();
  const [selectedClassNumber, setSelectedClassNumber] = useState<number | undefined>();

  const updateFilters = (newGrade?: number, newClassNumber?: number, newSearchTerm?: string) => {
    const filters: RecordsFilters = {
      recordType,
      ...(newGrade && { grade: newGrade }),
      ...(newClassNumber && { classNumber: newClassNumber }),
      ...(newSearchTerm && { search: newSearchTerm }),
    };
    onFiltersChange(filters);
  };

  const handleGradeSelect = (grade: number) => {
    setSelectedGrade(grade);
    setSelectedClassNumber(undefined);
    updateFilters(grade, undefined, searchTerm);
  };

  const handleClassSelect = (classNumber: number) => {
    setSelectedClassNumber(classNumber);
    updateFilters(selectedGrade, classNumber, searchTerm);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters(selectedGrade, selectedClassNumber, value);
  };

  const resetGradeFilter = () => {
    setSelectedGrade(undefined);
    updateFilters(undefined, selectedClassNumber, searchTerm);
  };

  const resetClassFilter = () => {
    setSelectedClassNumber(undefined);
    updateFilters(selectedGrade, undefined, searchTerm);
  };

  return (
    <div className="flex items-center gap-4">
      <Dropdown className="flex">
        <Dropdown.Trigger
          className="flex min-w-[120px] items-center justify-between rounded-[10px] border border-gray-2 px-4 py-[11px] text-body-16-m text-gray-black"
          iconPosition="right"
        >
          {selectedGrade ? `${selectedGrade}학년` : '학년'}
        </Dropdown.Trigger>
        <Dropdown.Content className="max-h-40 overflow-y-auto rounded-[10px]">
          <Dropdown.Item onClick={resetGradeFilter} index={0} className="px-4 py-[11px]">
            전체
          </Dropdown.Item>
          {grades?.map((grade, index) => (
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

      <Dropdown className="flex">
        <Dropdown.Trigger
          className="flex min-w-[120px] items-center justify-between rounded-[10px] border border-gray-2 px-4 py-[11px] text-body-16-m text-gray-black"
          iconPosition="right"
        >
          {selectedClassNumber ? `${selectedClassNumber}반` : '반'}
        </Dropdown.Trigger>
        <Dropdown.Content className="max-h-40 overflow-y-auto rounded-[10px]">
          <Dropdown.Item onClick={resetClassFilter} index={0} className="px-4 py-[11px]">
            전체
          </Dropdown.Item>
          {classNumbers?.map((classNumber, index) => (
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

      <div className="relative">
        <Input
          type="text"
          placeholder="이름"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={disabled}
          className="h-[48px] min-w-[200px] rounded-[10px] border border-gray-2 py-[11px] pl-4 pr-10"
        />
        <Icons.Search
          size={20}
          color="text-gray-4"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
