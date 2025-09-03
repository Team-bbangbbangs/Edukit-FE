'use client';

import { useState } from 'react';

import Image from 'next/image';

import { usePatchStudents } from '@/domains/record/apis/mutations/use-patch-students';
import { RecordTag } from '@/domains/record/components/manage-student/record-tag';
import { RECORD_TYPE } from '@/domains/record/constants/record-type';
import type { Student, RecordType } from '@/domains/record/types/record';
import Dropdown from '@/shared/components/ui/dropdown/dropdown';

import { EditCell } from './edit-cell';

interface StudentRowProps {
  student: Student;
  isSelected: boolean;
  onToggleSelect: (studentId: number) => void;
  forwardRef?: React.Ref<HTMLDivElement>;
}

export function StudentRow({ student, isSelected, onToggleSelect, forwardRef }: StudentRowProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tempRecordTypes, setTempRecordTypes] = useState<RecordType[]>([]);

  const { mutate: patchStudents } = usePatchStudents();

  const getSortedRecordTypes = (recordTypes: RecordType[]): RecordType[] => {
    const order: RecordType[] = ['SUBJECT', 'BEHAVIOR', 'CAREER', 'FREE', 'CLUB'];
    return order.filter((type) => recordTypes.includes(type));
  };

  const handleDropdownOpen = () => {
    setTempRecordTypes([...student.recordTypes]);
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    const sortedFinal = getSortedRecordTypes(tempRecordTypes);
    const sortedOriginal = getSortedRecordTypes(student.recordTypes);

    const hasChanges = JSON.stringify(sortedFinal) !== JSON.stringify(sortedOriginal);

    if (hasChanges) {
      const updatedStudent: Student = {
        ...student,
        recordTypes: sortedFinal,
      };
      patchStudents(updatedStudent);
    }

    setTempRecordTypes([]);
    setIsDropdownOpen(false);
  };

  const handleAddRecordType = (recordType: RecordType) => {
    if (!tempRecordTypes.includes(recordType)) {
      setTempRecordTypes([...tempRecordTypes, recordType]);
    }
  };

  const handleRemoveRecordType = (recordType: RecordType) => {
    setTempRecordTypes(tempRecordTypes.filter((rt) => rt !== recordType));
  };

  const currentRecordTypes = isDropdownOpen ? tempRecordTypes : student.recordTypes;

  return (
    <div ref={forwardRef} className="flex items-center self-stretch border-b border-gray-2">
      <div
        className="flex w-14 cursor-pointer items-center justify-center border-r border-gray-2 py-4"
        onClick={() => onToggleSelect(student.studentId)}
      >
        <Image
          src={isSelected ? '/svgs/ic_24_box_checked.svg' : '/svgs/ic_24_box_default.svg'}
          alt="checkbox"
          width={24}
          height={24}
        />
      </div>

      <EditCell
        student={student}
        field="grade"
        value={student.grade}
        onSave={patchStudents}
        className="w-[100px]"
      />
      <EditCell
        student={student}
        field="classNumber"
        value={student.classNumber}
        onSave={patchStudents}
        className="w-[100px]"
      />
      <EditCell
        student={student}
        field="studentNumber"
        value={student.studentNumber}
        onSave={patchStudents}
        className="w-[200px]"
      />
      <EditCell
        student={student}
        field="studentName"
        value={student.studentName}
        onSave={patchStudents}
        className="w-[140px]"
      />

      <div className="flex flex-1">
        <Dropdown
          className="w-full"
          onOpenChange={(open) => {
            if (open && !isDropdownOpen) {
              handleDropdownOpen();
            } else if (!open && isDropdownOpen) {
              handleDropdownClose();
            }
          }}
        >
          <Dropdown.Trigger
            className={`flex h-[58px] w-full cursor-pointer flex-wrap content-center items-center gap-[10px] border-none p-[10px] ${
              isDropdownOpen ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {currentRecordTypes.length === 0 ? (
              <span
                className={`text-body-16-m ${isDropdownOpen ? 'text-blue-400' : 'text-gray-5'}`}
              >
                항목 추가
              </span>
            ) : (
              currentRecordTypes.map((recordType) => (
                <RecordTag key={recordType} recordType={recordType} showClose={false} />
              ))
            )}
          </Dropdown.Trigger>

          <Dropdown.Content className="mt-[6px] inline-flex w-[152px] flex-col items-start p-2">
            {RECORD_TYPE.map((option) => {
              const isAlreadySelected = currentRecordTypes.includes(option.value);

              return (
                <div key={option.value} className="flex cursor-pointer items-center px-3 py-2">
                  <RecordTag
                    recordType={option.value}
                    showClose={isAlreadySelected}
                    onRemove={
                      isAlreadySelected
                        ? (e) => {
                            e.stopPropagation();
                            handleRemoveRecordType(option.value);
                          }
                        : undefined
                    }
                    onClick={
                      !isAlreadySelected ? () => handleAddRecordType(option.value) : undefined
                    }
                  />
                </div>
              );
            })}
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  );
}
