import { useRef, useState } from 'react';

import { usePostStudents } from '@/domains/record/apis/mutations/use-post-students';
import { RECORD_TYPE } from '@/domains/record/constants/record-type';
import type { RecordType, CreateStudentRequest } from '@/domains/record/types/record';
import Button from '@/shared/components/ui/button/button';
import Dropdown from '@/shared/components/ui/dropdown/dropdown';
import { Icons } from '@/shared/components/ui/icon/icon';

import { RecordTag } from './record-tag';

interface AddStudentProps {
  onCancel: () => void;
}

export function AddStudentRow({ onCancel }: AddStudentProps) {
  const { mutate: postStudents, isPending: isPostPending } = usePostStudents();
  const handleSaveNewStudent = (studentData: CreateStudentRequest) => {
    postStudents(studentData, {
      onSuccess: () => {
        onCancel();
      },
    });
  };

  const gradeRef = useRef<HTMLInputElement>(null);
  const classNumberRef = useRef<HTMLInputElement>(null);
  const studentNumberRef = useRef<HTMLInputElement>(null);
  const studentNameRef = useRef<HTMLInputElement>(null);

  const [recordTypes, setRecordTypes] = useState<RecordType[]>([]);

  const handleRecordTypeToggle = (recordType: RecordType) => {
    setRecordTypes((prev) => {
      const updatedRecordTypes = prev.includes(recordType)
        ? prev.filter((type) => type !== recordType)
        : [...prev, recordType];

      const order: RecordType[] = ['SUBJECT', 'BEHAVIOR', 'CAREER', 'FREE', 'CLUB'];
      return order.filter((type) => updatedRecordTypes.includes(type));
    });
  };

  const handleSave = () => {
    const gradeValue = gradeRef.current?.value.trim() || '';
    const classNumberValue = classNumberRef.current?.value.trim() || '';
    const studentNumberValue = studentNumberRef.current?.value.trim() || '';
    const studentName = studentNameRef.current?.value.trim() || '';

    if (!gradeValue) {
      alert('학년을 입력해주세요.');
      gradeRef.current?.focus();
      return;
    }
    if (!classNumberValue) {
      alert('반을 입력해주세요.');
      classNumberRef.current?.focus();
      return;
    }
    if (!studentNumberValue) {
      alert('번호를 입력해주세요.');
      studentNumberRef.current?.focus();
      return;
    }
    if (!studentName) {
      alert('학생 이름을 입력해주세요.');
      studentNameRef.current?.focus();
      return;
    }

    const grade = Number(gradeValue);
    const classNumber = Number(classNumberValue);
    const studentNumber = Number(studentNumberValue);

    if (isNaN(grade) || grade <= 0) {
      alert('학년은 1 이상의 숫자여야 합니다.');
      gradeRef.current?.focus();
      return;
    }
    if (isNaN(classNumber) || classNumber <= 0) {
      alert('반은 1 이상의 숫자여야 합니다.');
      classNumberRef.current?.focus();
      return;
    }
    if (isNaN(studentNumber) || studentNumber <= 0) {
      alert('번호는 1 이상의 숫자여야 합니다.');
      studentNumberRef.current?.focus();
      return;
    }

    const studentData: CreateStudentRequest = {
      grade,
      classNumber,
      studentNumber,
      studentName,
      recordTypes,
    };

    handleSaveNewStudent(studentData);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="flex items-center self-stretch border-b border-gray-2">
      <div className="flex w-14 items-center justify-center border-r border-gray-2 py-4">
        <Icons.BoxDefault color="text-gray-2" />
      </div>

      {/* 학년 */}
      <div className="flex w-[100px] items-center justify-center border-r border-gray-2 px-9 py-4">
        <input
          ref={gradeRef}
          type="text"
          className="w-full bg-transparent text-center text-body-16-m text-gray-black outline-none"
          placeholder="입력"
        />
      </div>

      {/* 반 */}
      <div className="flex w-[100px] items-center justify-center border-r border-gray-2 px-9 py-4">
        <input
          ref={classNumberRef}
          type="text"
          className="w-full bg-transparent text-center text-body-16-m text-gray-black outline-none"
          placeholder="입력"
        />
      </div>

      {/* 번호 */}
      <div className="flex w-[200px] items-center justify-center border-r border-gray-2 px-10 py-4">
        <input
          ref={studentNumberRef}
          type="text"
          className="w-full bg-transparent text-center text-body-16-m text-gray-black outline-none"
          placeholder="입력"
        />
      </div>

      {/* 이름 */}
      <div className="flex w-[140px] items-center justify-center border-r border-gray-2 px-10 py-4">
        <input
          ref={studentNameRef}
          type="text"
          className="w-full bg-transparent text-center text-body-16-m text-gray-black outline-none"
          placeholder="입력"
        />
      </div>

      {/* recordTypes 드롭다운 */}
      <div className="flex flex-1">
        <div className="flex-1">
          <Dropdown className="w-full">
            <Dropdown.Trigger className="group flex h-[58px] w-full cursor-pointer flex-wrap content-center items-center gap-[10px] border-none bg-white p-[10px] hover:bg-gray-50 data-[state=open]:bg-blue-50">
              {recordTypes.length === 0 ? (
                <span className="text-body-16-m text-gray-5 group-data-[state=open]:text-blue-400">
                  항목 추가
                </span>
              ) : (
                recordTypes.map((recordType) => (
                  <RecordTag key={recordType} recordType={recordType} showClose={false} />
                ))
              )}
            </Dropdown.Trigger>

            <Dropdown.Content className="!mt-0 inline-flex w-[152px] flex-col items-start p-2">
              {RECORD_TYPE.map((option) => {
                const isSelected = recordTypes.includes(option.value);

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
                      onClick={!isSelected ? () => handleRecordTypeToggle(option.value) : undefined}
                    />
                  </div>
                );
              })}
            </Dropdown.Content>
          </Dropdown>
        </div>

        <div className="flex items-center gap-2">
          <Button
            color="secondary"
            variant="stroke"
            size="small"
            shape="pill"
            onClick={handleCancel}
            disabled={isPostPending}
          >
            <span className="text-label-14 text-gray-4">취소</span>
          </Button>
          <Button
            color="primary"
            variant="fill"
            size="small"
            shape="pill"
            onClick={handleSave}
            disabled={isPostPending}
          >
            <span className="text-label-14 text-white">
              {isPostPending ? '추가 중...' : '추가'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
