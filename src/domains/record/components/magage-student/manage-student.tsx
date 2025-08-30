'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useGetStudent } from '@/domains/record/apis/infinite-queries/get-student';
import type { StudentsResponse, Student } from '@/domains/record/types/record';
import Button from '@/shared/components/ui/button/button';
import ExcelUploadModal from '@/shared/components/ui/modal/excel-upload-modal';
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll';

import type { InfiniteData } from '@tanstack/react-query';

export default function ManageStudent() {
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useGetStudent(
    {},
  );

  const lastStudentElementRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isFetching: isFetchingNextPage,
    threshold: 0.1,
  });

  const infiniteData = data as InfiniteData<StudentsResponse> | undefined;
  const allStudents: Student[] = infiniteData?.pages.flatMap((page) => page.students) || [];
  const totalCount = infiniteData?.pages[0]?.studentCount || 0;

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

      {/* filter */}
      <div className="mb-[29px] flex w-[1135px] items-center justify-between">
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
      </div>

      {/* dashboard */}
      <div className="mb-80 flex w-[1135px] flex-col items-start">
        {/* dashboard header */}
        <div className="flex items-center self-stretch bg-gray-1">
          <div className="flex w-14 items-center justify-center py-4">
            <Image src={'/svgs/ic_24_box_default.svg'} alt="defaultBox" width={24} height={24} />
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
            <div className="text-gray-4">로딩중...</div>
          </div>
        ) : error ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
          </div>
        ) : totalCount === 0 ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-gray-4">등록된 학생이 없습니다.</div>
          </div>
        ) : (
          <>
            {allStudents.map((student: Student, index: number) => {
              const isLast = index === allStudents.length - 1;
              return (
                <div
                  key={student.studentId}
                  ref={isLast ? lastStudentElementRef : null}
                  className="flex items-center self-stretch border-b border-gray-2"
                >
                  <div className="flex w-14 items-center justify-center border-r border-gray-2 py-4">
                    <Image
                      src={'/svgs/ic_24_box_default.svg'}
                      alt="defaultBox"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="flex w-[100px] items-center justify-center border-r border-gray-2 px-10 py-4">
                    <span className="text-body-16-m text-gray-black">{student.grade}</span>
                  </div>
                  <div className="flex w-[100px] items-center justify-center border-r border-gray-2 px-10 py-4">
                    <span className="text-body-16-m text-gray-black">{student.classNumber}</span>
                  </div>
                  <div className="flex w-[200px] items-center justify-center border-r border-gray-2 px-10 py-4">
                    <span className="text-body-16-m text-gray-black">{student.studentNumber}</span>
                  </div>
                  <div className="flex w-[140px] items-center justify-center border-r border-gray-2 px-10 py-4">
                    <span className="text-body-16-m text-gray-black">{student.studentName}</span>
                  </div>
                  <div className="flex flex-1 flex-wrap items-center justify-center p-[10px]">
                    <span className="text-body-16-m text-gray-black">
                      {student.recordTypes.join(', ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <ExcelUploadModal open={excelModalOpen} onOpenChange={setExcelModalOpen} />
    </div>
  );
}
