import { useState, useEffect } from 'react';

import { useDeleteStudents } from '@/domains/record/apis/mutations/use-delete-students';
import { RecordTag } from '@/domains/record/components/manage-student/record-tag';
import { RECORD_TYPE } from '@/domains/record/constants/record-type';
import type { RecordType, StudentFilters } from '@/domains/record/types/record';
import Button from '@/shared/components/ui/button/button';
import Dropdown from '@/shared/components/ui/dropdown/dropdown';
import { Icons } from '@/shared/components/ui/icon/icon';
import DeleteConfirmModal from '@/shared/components/ui/modal/delete-confirm-modal';

interface FilterSectionProps {
  selectedIds: number[];
  totalCount: number;
  grades?: number[];
  classNumbers?: number[];
  onClearSelection: () => void;
  onFiltersChange: (filters: StudentFilters) => void;
  disabled?: boolean;
}

export function FilterSection({
  selectedIds,
  totalCount,
  grades,
  classNumbers,
  onClearSelection,
  onFiltersChange,
  disabled = false,
}: FilterSectionProps) {
  const hasSelection = selectedIds.length > 0;

  const { mutate: deleteStudents } = useDeleteStudents();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<'grade' | 'class' | 'record'>>(new Set());
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedRecordTypes, setSelectedRecordTypes] = useState<RecordType[]>([]);

  useEffect(() => {
    const filters: StudentFilters = {};

    if (selectedGrades.length > 0) {
      filters.grades = selectedGrades;
    }

    if (selectedClasses.length > 0) {
      filters.classNumbers = selectedClasses;
    }

    if (selectedRecordTypes.length > 0) {
      filters.recordTypes = selectedRecordTypes;
    }

    onFiltersChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGrades, selectedClasses, selectedRecordTypes]);

  const handleDelete = () => {
    setDeleteModalOpen(false);
    deleteStudents(
      { studentIds: selectedIds },
      {
        onSuccess: () => {
          onClearSelection();
        },
      },
    );
  };

  const handleFilterToggle = (filterType: 'grade' | 'class' | 'record') => {
    setActiveFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(filterType)) {
        newSet.delete(filterType);
        if (filterType === 'grade') setSelectedGrades([]);
        if (filterType === 'class') setSelectedClasses([]);
        if (filterType === 'record') setSelectedRecordTypes([]);
      } else {
        newSet.add(filterType);
      }
      return newSet;
    });
  };

  const handleGradeToggle = (grade: number) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade],
    );
  };

  const handleClassToggle = (classNumber: number) => {
    setSelectedClasses((prev) =>
      prev.includes(classNumber) ? prev.filter((c) => c !== classNumber) : [...prev, classNumber],
    );
  };

  const handleRecordTypeToggle = (recordType: RecordType) => {
    setSelectedRecordTypes((prev) =>
      prev.includes(recordType) ? prev.filter((r) => r !== recordType) : [...prev, recordType],
    );
  };

  const removeFilter = (filterType: 'grade' | 'class' | 'record') => {
    setActiveFilters((prev) => {
      const newSet = new Set(prev);
      newSet.delete(filterType);
      return newSet;
    });

    if (filterType === 'grade') setSelectedGrades([]);
    if (filterType === 'class') setSelectedClasses([]);
    if (filterType === 'record') setSelectedRecordTypes([]);
  };

  const handleDropdownClose = (filterType: 'grade' | 'class' | 'record', isOpen: boolean) => {
    if (!isOpen) {
      const hasSelectedItems =
        filterType === 'grade'
          ? selectedGrades.length > 0
          : filterType === 'class'
            ? selectedClasses.length > 0
            : selectedRecordTypes.length > 0;

      if (!hasSelectedItems) {
        removeFilter(filterType);
      }
    }
  };

  const getFilterDisplayText = (filterType: 'grade' | 'class' | 'record') => {
    switch (filterType) {
      case 'grade':
        return selectedGrades.length > 0
          ? selectedGrades
              .sort((a, b) => a - b)
              .map((g) => `${g}`)
              .join(', ')
          : '';
      case 'class':
        return selectedClasses.length > 0
          ? selectedClasses
              .sort((a, b) => a - b)
              .map((c) => `${c}`)
              .join(', ')
          : '';
      case 'record':
        return selectedRecordTypes.length > 0
          ? selectedRecordTypes.map((r) => RECORD_TYPE.find((t) => t.value === r)?.label).join(', ')
          : '';
      default:
        return '';
    }
  };

  return (
    <>
      <div
        className={` ${activeFilters.size > 0 ? 'mb-5' : 'mb-[29px]'} flex w-[1135px] items-center justify-between`}
      >
        {hasSelection ? (
          <>
            <span className="text-title-20 text-blue-400">
              총 {selectedIds.length}명의 학생 선택
            </span>
            <div className="flex items-center gap-3">
              <Button
                color="primary"
                variant="stroke"
                size="small"
                shape="pill"
                onClick={() => setDeleteModalOpen(true)}
                disabled={disabled}
              >
                <span className="text-label-16 text-blue-400">삭제</span>
              </Button>
              <Button
                color="secondary"
                variant="stroke"
                size="small"
                shape="pill"
                onClick={onClearSelection}
                disabled={disabled}
              >
                <span className="text-label-16 text-gray-4">취소</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="text-title-20 text-gray-4">총 {totalCount}명의 학생 등록</span>
            <Dropdown>
              <Dropdown.Trigger
                disabled={disabled}
                className={`flex items-center justify-center gap-2 rounded-full border ${activeFilters.size > 0 ? 'border-blue-400' : 'border-gray-2'} bg-white px-3 py-2 ${disabled ? 'cursor-not-allowed bg-gray-1 text-gray-3' : 'hover:bg-gray-1'}`}
              >
                <span
                  className={`text-label-16 ${activeFilters.size > 0 ? 'text-blue-400' : 'text-gray-4'}`}
                >
                  필터
                </span>
                {activeFilters.size > 0 ? (
                  <Icons.Filter size={20} color="text-blue-400" />
                ) : (
                  <Icons.Filter size={20} color="text-gray-4" />
                )}
              </Dropdown.Trigger>
              <Dropdown.Content className="right-0 flex !w-[146px] flex-col items-start p-2">
                <Dropdown.Item
                  className="flex w-full cursor-pointer items-center rounded-[8px] hover:bg-gray-1"
                  onClick={() => handleFilterToggle('grade')}
                >
                  학년
                </Dropdown.Item>
                <Dropdown.Item
                  className="flex w-full cursor-pointer items-center rounded-[8px] hover:bg-gray-1"
                  onClick={() => handleFilterToggle('class')}
                >
                  반
                </Dropdown.Item>
                <Dropdown.Item
                  className="flex w-full cursor-pointer items-center rounded-[8px] hover:bg-gray-1"
                  onClick={() => handleFilterToggle('record')}
                >
                  생기부 관리 항목
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </>
        )}
      </div>

      {/* 활성화된 필터 표시 영역 */}
      {activeFilters.size > 0 ? (
        <div className="mb-[25px] inline-flex w-[1135px] items-center gap-3">
          {activeFilters.has('grade') ? (
            <Dropdown
              defaultOpen={activeFilters.has('grade')}
              onOpenChange={(isOpen) => handleDropdownClose('grade', isOpen)}
            >
              <Dropdown.Trigger className="group flex items-center justify-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
                <span className="text-label-16 text-blue-400">
                  학년: {getFilterDisplayText('grade')}
                </span>
                <Icons.ChevronUp
                  size={18}
                  color="text-blue-400"
                  className="hidden group-data-[state=open]:block"
                />

                <Icons.Close
                  size={18}
                  color="text-blue-400"
                  hoverColor="text-blue-600"
                  className={`hidden cursor-pointer ${selectedGrades.length > 0 ? 'group-data-[state=closed]:block' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter('grade');
                  }}
                />
              </Dropdown.Trigger>
              <Dropdown.Content className="flex !w-[95px] flex-col items-start p-2">
                {grades?.map((grade) => (
                  <div
                    key={grade}
                    className="flex w-full cursor-pointer items-center rounded-[8px] px-3 py-2 hover:bg-gray-1"
                    onClick={() => handleGradeToggle(grade)}
                  >
                    <span className="w-[39px] truncate text-body-16-m text-gray-black">
                      {grade}
                    </span>
                    {selectedGrades.includes(grade) ? (
                      <Icons.Check size={18} color="text-blue-400" />
                    ) : null}
                  </div>
                ))}
              </Dropdown.Content>
            </Dropdown>
          ) : null}

          {activeFilters.has('class') ? (
            <Dropdown
              defaultOpen={activeFilters.has('class')}
              onOpenChange={(isOpen) => handleDropdownClose('class', isOpen)}
            >
              <Dropdown.Trigger className="group flex items-center justify-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
                <span className="text-label-16 text-blue-400">
                  반: {getFilterDisplayText('class')}
                </span>
                <Icons.ChevronUp
                  size={18}
                  color="text-blue-400"
                  className="hidden group-data-[state=open]:block"
                />

                <Icons.Close
                  size={18}
                  color="text-blue-400"
                  hoverColor="text-blue-600"
                  className={`hidden cursor-pointer ${selectedClasses.length > 0 ? 'group-data-[state=closed]:block' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter('class');
                  }}
                />
              </Dropdown.Trigger>
              <Dropdown.Content className="flex !w-[95px] flex-col items-start p-2">
                {classNumbers?.map((classNumber) => (
                  <div
                    key={classNumber}
                    className="flex w-full cursor-pointer items-center rounded-[8px] px-3 py-2 hover:bg-gray-1"
                    onClick={() => handleClassToggle(classNumber)}
                  >
                    <span className="w-[39px] truncate text-body-16-m text-gray-black">
                      {classNumber}
                    </span>
                    {selectedClasses.includes(classNumber) ? (
                      <Icons.Check size={18} color="text-blue-400" />
                    ) : null}
                  </div>
                ))}
              </Dropdown.Content>
            </Dropdown>
          ) : null}

          {activeFilters.has('record') ? (
            <Dropdown
              defaultOpen={activeFilters.has('record')}
              onOpenChange={(isOpen) => handleDropdownClose('record', isOpen)}
            >
              <Dropdown.Trigger className="group flex items-center justify-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
                <span className="text-label-16 text-blue-400">
                  생활기록부 관리 항목: {getFilterDisplayText('record')}
                </span>
                <Icons.ChevronUp
                  size={18}
                  color="text-blue-400"
                  className="hidden group-data-[state=open]:block"
                />

                <Icons.Close
                  size={18}
                  color="text-blue-400"
                  hoverColor="text-blue-600"
                  className={`hidden cursor-pointer ${selectedRecordTypes.length > 0 ? 'group-data-[state=closed]:block' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter('record');
                  }}
                />
              </Dropdown.Trigger>
              <Dropdown.Content className="!mt-2 inline-flex !w-[156px] flex-col items-start p-2">
                {RECORD_TYPE.map((option) => {
                  const isSelected = selectedRecordTypes.includes(option.value);

                  return (
                    <div key={option.value} className="flex cursor-pointer items-center px-3 py-2">
                      <RecordTag
                        recordType={option.value}
                        showClose={isSelected}
                        onRemove={
                          isSelected
                            ? (e) => {
                                e.stopPropagation();
                                handleRecordTypeToggle(option.value);
                              }
                            : undefined
                        }
                        onClick={
                          !isSelected ? () => handleRecordTypeToggle(option.value) : undefined
                        }
                      />
                    </div>
                  );
                })}
              </Dropdown.Content>
            </Dropdown>
          ) : null}
        </div>
      ) : null}

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onDelete={handleDelete}
      />
    </>
  );
}
