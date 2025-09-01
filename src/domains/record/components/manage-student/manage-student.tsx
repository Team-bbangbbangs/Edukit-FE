'use client';

import { useState, useRef } from 'react';

import Image from 'next/image';

import { useGetStudents } from '@/domains/record/apis/infinite-queries/get-students';
import { useDeleteStudents } from '@/domains/record/apis/mutations/use-delete-students';
import { usePatchStudents } from '@/domains/record/apis/mutations/use-patch-students';
import { RecordTag } from '@/domains/record/components/manage-student/record-tag';
import { RECORD_TYPE } from '@/domains/record/constants/record-type';
import type { StudentsResponse, Student, RecordType } from '@/domains/record/types/record';
import Button from '@/shared/components/ui/button/button';
import Dropdown from '@/shared/components/ui/dropdown/dropdown';
import DeleteConfirmModal from '@/shared/components/ui/modal/delete-confirm-modal';
import ExcelUploadModal from '@/shared/components/ui/modal/excel-upload-modal';
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll';

import type { InfiniteData } from '@tanstack/react-query';

interface EditableCellProps {
  student: Student;
  field: keyof Pick<Student, 'grade' | 'classNumber' | 'studentNumber' | 'studentName'>;
  value: string | number;
  onSave: (updatedStudent: Student) => void;
  className?: string;
}

function EditableCell({ student, field, value, onSave, className }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (tempValue.trim() === '') {
      setError('입력값은 비워놓을 수 없습니다.');
      setIsEditing(true);
      return;
    }

    setError('');
    setIsEditing(false);

    if (tempValue !== value.toString()) {
      const isNumberField = ['grade', 'classNumber', 'studentNumber'].includes(field);
      let finalValue: string | number = tempValue;

      if (isNumberField) {
        const numValue = Number(tempValue);
        if (isNaN(numValue)) {
          setError('숫자만 입력 가능합니다.');
          setIsEditing(true);
          return;
        }
        finalValue = numValue;
      }

      const updatedStudent: Student = {
        ...student,
        [field]: finalValue,
      };
      onSave(updatedStudent);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center border-r border-gray-2 px-10 py-4 transition-colors ${className} ${error ? 'border-red-500' : ''} ${isEditing ? 'border-blue-400 ring-1 ring-blue-300' : 'cursor-pointer hover:bg-gray-50'} focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-300`}
      onClick={() => {
        if (!isEditing) {
          setIsEditing(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent text-center text-body-16-m text-gray-black outline-none"
        />
      ) : (
        <span className="text-body-16-m text-gray-black">{value}</span>
      )}

      {error ? (
        <span className="absolute -bottom-5 whitespace-nowrap text-xs text-red-500">{error}</span>
      ) : null}
    </div>
  );
}

export default function ManageStudent() {
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [tempRecordTypes, setTempRecordTypes] = useState<Record<number, RecordType[]>>({});

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useGetStudents(
    {},
  );

  const { mutate: deleteStudents } = useDeleteStudents();
  const { mutate: patchStudents } = usePatchStudents();

  const lastStudentElementRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isFetching: isFetchingNextPage,
    threshold: 0.1,
  });

  const infiniteData = data as InfiniteData<StudentsResponse> | undefined;
  const allStudents: Student[] = infiniteData?.pages.flatMap((page) => page.students) || [];
  const totalCount = infiniteData?.pages[0]?.studentCount || 0;

  const isAllSelected = allStudents.length > 0 && selectedIds.length === allStudents.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allStudents.map((s) => s.studentId));
    }
  };

  const handleToggleStudent = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = () => {
    setDeleteModalOpen(false);
    deleteStudents({ studentIds: selectedIds });
  };

  // recordTypes 정렬
  const getSortedRecordTypes = (recordTypes: RecordType[]): RecordType[] => {
    const order: RecordType[] = ['SUBJECT', 'BEHAVIOR', 'CAREER', 'FREE', 'CLUB'];
    return order.filter((type) => recordTypes.includes(type));
  };

  const handleDropdownOpen = (studentId: number) => {
    const student = allStudents.find((s) => s.studentId === studentId);
    if (!student) return;

    setTempRecordTypes((prev) => ({
      ...prev,
      [studentId]: [...student.recordTypes],
    }));
    setOpenDropdownId(studentId);
  };

  const handleDropdownClose = (studentId: number) => {
    const student = allStudents.find((s) => s.studentId === studentId);
    if (!student) return;

    const finalRecordTypes = tempRecordTypes[studentId] || student.recordTypes;

    const sortedFinal = getSortedRecordTypes(finalRecordTypes);
    const sortedOriginal = getSortedRecordTypes(student.recordTypes);

    const hasChanges = JSON.stringify(sortedFinal) !== JSON.stringify(sortedOriginal);

    if (hasChanges) {
      const updatedStudent: Student = {
        ...student,
        recordTypes: sortedFinal,
      };
      patchStudents(updatedStudent);
    }

    setTempRecordTypes((prev) => {
      const newState = { ...prev };
      delete newState[studentId];
      return newState;
    });

    setOpenDropdownId(null);
  };

  const handleAddRecordType = (studentId: number, recordType: RecordType) => {
    setTempRecordTypes((prev) => {
      const currentTypes = prev[studentId] || [];
      if (currentTypes.includes(recordType)) {
        return prev;
      }
      return {
        ...prev,
        [studentId]: [...currentTypes, recordType],
      };
    });
  };

  const handleRemoveRecordType = (studentId: number, recordType: RecordType) => {
    setTempRecordTypes((prev) => {
      const currentTypes = prev[studentId] || [];
      return {
        ...prev,
        [studentId]: currentTypes.filter((rt) => rt !== recordType),
      };
    });
  };

  return (
    <div className="flex w-full flex-col justify-center">
      {/* header */}
      <div className="mb-14 flex w-[1135px] items-center justify-between">
        <h2 className="text-heading-24">학생 관리</h2>
        <div className="flex items-center gap-[10px]">
          <Button
            color="primary"
            variant="stroke"
            size="medium"
            shape="rect"
            className="flex items-center gap-2"
          >
            <span className="text-label-16 text-blue-400">학생 추가</span>
            <Image
              src={'/svgs/ic_18_add.svg'}
              alt="plus"
              width={20}
              height={20}
              className="text-blue-400"
            />
          </Button>
          <Button
            color="primary"
            variant="fill"
            size="medium"
            shape="rect"
            className="text-label-16 text-white"
            onClick={() => setExcelModalOpen(true)}
          >
            엑셀 파일에서 명단 업로드
          </Button>
        </div>
      </div>

      {/* filter / action bar */}
      <div className="mb-[29px] flex w-[1135px] items-center justify-between">
        {selectedIds.length === 0 ? (
          <>
            <span className="text-title-20 text-gray-4">총 {totalCount}명의 학생 등록</span>
            <Button
              color="secondary"
              variant="stroke"
              size="small"
              shape="pill"
              className="flex items-center justify-center gap-2"
            >
              <span className="text-label-16 text-gray-4">필터</span>
              <Image
                src={'/svgs/ic_20_filter.svg'}
                alt="filter"
                width={20}
                height={20}
                className="text-gray-4"
              />
            </Button>
          </>
        ) : (
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
              >
                <span className="text-label-16 text-blue-400">삭제</span>
              </Button>
              <Button
                color="secondary"
                variant="stroke"
                size="small"
                shape="pill"
                onClick={() => setSelectedIds([])}
              >
                <span className="text-label-16 text-gray-4">취소</span>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* dashboard */}
      <div className="mb-80 flex w-[1135px] flex-col items-start">
        {/* dashboard header */}
        <div className="flex items-center self-stretch bg-gray-1">
          <div
            className="flex w-14 cursor-pointer items-center justify-center py-4"
            onClick={handleToggleAll}
          >
            <Image
              src={isAllSelected ? '/svgs/ic_24_box_checked.svg' : '/svgs/ic_24_box_default.svg'}
              alt="defaultBox"
              width={24}
              height={24}
            />
          </div>
          <div className="flex w-[100px] items-center justify-center px-9 py-4">
            <span className="text-label-16 text-gray-4">학년</span>
          </div>
          <div className="flex w-[100px] items-center justify-center px-10 py-4">
            <span className="text-label-16 text-gray-4">반</span>
          </div>
          <div className="flex w-[200px] items-center justify-center px-10 py-4">
            <span className="text-label-16 text-gray-4">번호</span>
          </div>
          <div className="flex w-[140px] items-center justify-center px-10 py-4">
            <span className="text-label-16 text-gray-4">이름</span>
          </div>
          <div className="flex flex-1 items-center justify-center px-10 py-4">
            <span className="text-label-16 text-gray-4">생활기록부 관리 항목</span>
          </div>
        </div>

        {/* dashboard body */}
        {isLoading ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-gray-black">로딩중...</div>
          </div>
        ) : error ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
          </div>
        ) : totalCount === 0 ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-gray-black">등록된 학생이 없습니다.</div>
          </div>
        ) : (
          <>
            {allStudents.map((student: Student, index: number) => {
              const isLast = index === allStudents.length - 1;
              const isSelected = selectedIds.includes(student.studentId);
              const isDropdownOpen = openDropdownId === student.studentId;

              const currentRecordTypes = isDropdownOpen
                ? tempRecordTypes[student.studentId] || student.recordTypes
                : student.recordTypes;

              return (
                <div
                  key={student.studentId}
                  ref={isLast ? lastStudentElementRef : null}
                  className="flex items-center self-stretch border-b border-gray-2"
                >
                  <div
                    className="flex w-14 cursor-pointer items-center justify-center border-r border-gray-2 py-4"
                    onClick={() => handleToggleStudent(student.studentId)}
                  >
                    <Image
                      src={
                        isSelected ? '/svgs/ic_24_box_checked.svg' : '/svgs/ic_24_box_default.svg'
                      }
                      alt="defaultBox"
                      width={24}
                      height={24}
                    />
                  </div>

                  {/* ✅ 수정 가능한 셀들 */}
                  <EditableCell
                    student={student}
                    field="grade"
                    value={student.grade}
                    onSave={patchStudents}
                    className="w-[100px]"
                  />
                  <EditableCell
                    student={student}
                    field="classNumber"
                    value={student.classNumber}
                    onSave={patchStudents}
                    className="w-[100px]"
                  />
                  <EditableCell
                    student={student}
                    field="studentNumber"
                    value={student.studentNumber}
                    onSave={patchStudents}
                    className="w-[200px]"
                  />
                  <EditableCell
                    student={student}
                    field="studentName"
                    value={student.studentName}
                    onSave={patchStudents}
                    className="w-[140px]"
                  />

                  {/* recordTypes 드롭다운 */}
                  <div className="flex flex-1">
                    <Dropdown
                      className="w-full"
                      onOpenChange={(open) => {
                        if (open && !isDropdownOpen) {
                          handleDropdownOpen(student.studentId);
                        } else if (!open && isDropdownOpen) {
                          handleDropdownClose(student.studentId);
                        }
                      }}
                    >
                      <Dropdown.Trigger
                        className={`flex h-[58px] w-full cursor-pointer flex-wrap content-center items-center gap-[10px] border-none p-[10px] ${isDropdownOpen ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
                      >
                        {currentRecordTypes.length === 0 ? (
                          <span
                            className={`text-body-16-m ${
                              isDropdownOpen ? 'text-blue-400' : 'text-gray-5'
                            }`}
                          >
                            항목 추가
                          </span>
                        ) : (
                          currentRecordTypes.map((recordType) => (
                            <RecordTag key={recordType} recordType={recordType} showClose={false} />
                          ))
                        )}
                      </Dropdown.Trigger>

                      <Dropdown.Content className="mt-[6px] inline-flex !w-auto flex-col items-start p-2">
                        {RECORD_TYPE.map((option) => {
                          const isAlreadySelected = currentRecordTypes.includes(option.value);

                          return (
                            <div
                              key={option.value}
                              className="flex cursor-pointer items-center px-3 py-2"
                            >
                              <RecordTag
                                recordType={option.value}
                                showClose={isAlreadySelected}
                                onRemove={
                                  isAlreadySelected
                                    ? (e) => {
                                        e.stopPropagation();
                                        handleRemoveRecordType(student.studentId, option.value);
                                      }
                                    : undefined
                                }
                                onClick={
                                  !isAlreadySelected
                                    ? () => handleAddRecordType(student.studentId, option.value)
                                    : undefined
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
            })}
          </>
        )}
      </div>

      <ExcelUploadModal open={excelModalOpen} onOpenChange={setExcelModalOpen} />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onDelete={handleDelete}
      />
    </div>
  );
}
