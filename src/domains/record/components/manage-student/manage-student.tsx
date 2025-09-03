'use client';

import { useState } from 'react';

import { useGetStudents } from '@/domains/record/apis/infinite-queries/get-students';
import type { StudentsResponse, Student, StudentFilters } from '@/domains/record/types/record';
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useGetStudents(filters);

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

  return (
    <div className="flex w-full flex-col justify-center">
      <ManageStudentHeader
        onAddStudent={() => setIsAddingStudent(true)}
        isAddingStudent={isAddingStudent}
      />

      <FilterSection
        selectedIds={selectedIds}
        totalCount={totalCount}
        grades={grades}
        classNumbers={classNumbers}
        onClearSelection={() => setSelectedIds([])}
        onFiltersChange={handleFiltersChange}
      />

      <div className="mb-80 flex w-[1135px] flex-col items-start">
        <DashboardHeader isAllSelected={isAllSelected} onToggleAll={handleToggleAll} />

        {isLoading ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-gray-black">로딩중...</div>
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
          </>
        )}
      </div>
    </div>
  );
}
