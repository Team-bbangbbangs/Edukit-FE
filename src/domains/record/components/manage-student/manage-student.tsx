'use client';

import { useState } from 'react';

import { useGetStudents } from '@/domains/record/apis/infinite-queries/use-get-students';
import type { StudentsResponse, Student, StudentFilters } from '@/domains/record/types/record';
import NotAuthorizedError from '@/shared/components/ui/error/not-authorized-error';
import NotPermissionError from '@/shared/components/ui/error/not-permission-error';
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll';

import { AddStudentRow } from './add-student-row';
import { DashboardHeader } from './dashboard-header';
import { FilterSection } from './filter-section';
import { ManageStudentHeader } from './manage-student-header';
import { StudentRow } from './student-row';

import type { InfiniteData } from '@tanstack/react-query';

export default function ManageStudent() {
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [filters, setFilters] = useState<StudentFilters>({});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isUnauthorized,
    isNotPermission,
  } = useGetStudents(filters);

  const lastStudentElementRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isFetching: isFetchingNextPage,
    threshold: 0.1,
  });

  const infiniteData = data as InfiniteData<StudentsResponse> | undefined;
  const allStudents: Student[] = infiniteData?.pages.flatMap((page) => page.students) || [];
  const totalCount = infiniteData?.pages[0]?.studentCount || 0;
  const grades = infiniteData?.pages[0]?.grades;
  const classNumbers = infiniteData?.pages[0]?.classNumbers;

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

  const handleFiltersChange = (newFilters: StudentFilters) => {
    setFilters(newFilters);
    setSelectedIds([]);
  };

  const hasError = isUnauthorized || isNotPermission || !!error;
  const isDisabled = hasError || isLoading;

  return (
    <div className="flex w-full flex-col justify-center p-[60px]">
      <ManageStudentHeader
        onAddStudent={() => setIsAddingStudent(true)}
        isAddingStudent={isAddingStudent}
        disabled={isDisabled}
      />

      <FilterSection
        selectedIds={selectedIds}
        totalCount={totalCount}
        grades={grades}
        classNumbers={classNumbers}
        onClearSelection={() => setSelectedIds([])}
        onFiltersChange={handleFiltersChange}
        disabled={isDisabled}
      />

      <div className="mb-80 flex w-[1135px] flex-col items-start">
        <DashboardHeader isAllSelected={isAllSelected} onToggleAll={handleToggleAll} />

        {isLoading ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-gray-black">로딩중...</div>
          </div>
        ) : isUnauthorized ? (
          <div className="flex w-full items-center justify-center py-8">
            <NotAuthorizedError />
          </div>
        ) : isNotPermission ? (
          <div className="flex w-full items-center justify-center py-8">
            <NotPermissionError />
          </div>
        ) : error ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
          </div>
        ) : totalCount === 0 && !isAddingStudent ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-gray-black">등록된 학생이 없습니다.</div>
          </div>
        ) : (
          <>
            {isAddingStudent ? <AddStudentRow onCancel={() => setIsAddingStudent(false)} /> : null}

            {allStudents.map((student: Student, index: number) => {
              const isLast = index === allStudents.length - 1;
              const isSelected = selectedIds.includes(student.studentId);

              return (
                <StudentRow
                  key={student.studentId}
                  student={student}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleStudent}
                  forwardRef={isLast ? lastStudentElementRef : undefined}
                />
              );
            })}

            {isFetchingNextPage ? (
              <div className="flex w-full items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                  <span className="text-body-16-m text-gray-4">추가 데이터를 불러오는 중...</span>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
