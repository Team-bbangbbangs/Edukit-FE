'use client';

import { useState } from 'react';

import { useGetRecords } from '@/domains/record/apis/infinite-queries/use-get-records';
import type {
  RecordsResponse,
  Records,
  RecordsFilters,
  RecordType,
} from '@/domains/record/types/record';
import NotAuthorizedError from '@/shared/components/ui/error/not-authorized-error';
import NotPermissionError from '@/shared/components/ui/error/not-permission-error';
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll';

import ManageRecordDashboardHeader from './manage-record-dashboard-header';
import ManageRecordHeader from './manage-record-header';
import RecordRow from './record-row';
import SearchBar from './search-bar';

import type { InfiniteData } from '@tanstack/react-query';

interface ManageRecordProps {
  recordType: RecordType;
}

export default function ManageRecord({ recordType }: ManageRecordProps) {
  const [filters, setFilters] = useState<RecordsFilters>({ recordType: recordType });
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isUnauthorized,
    isNotPermission,
  } = useGetRecords(filters);

  const lastRecordElementRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isFetching: isFetchingNextPage,
    threshold: 0.1,
  });

  const infiniteData = data as InfiniteData<RecordsResponse> | undefined;
  const allRecords: Records[] = infiniteData?.pages.flatMap((page) => page.studentRecords) || [];
  const totalCount = infiniteData?.pages[0]?.studentCount || 0;
  const grades = infiniteData?.pages[0]?.grades;
  const classNumbers = infiniteData?.pages[0]?.classNumbers;

  const handleFiltersChange = (newFilters: RecordsFilters) => {
    setFilters(newFilters);
  };

  const handleEditingChange = (recordId: number | null) => {
    setEditingRecordId(recordId);
  };

  const hasError = isUnauthorized || isNotPermission || !!error;
  const isDisabled = hasError || isLoading;

  return (
    <div className="flex w-full flex-col justify-center p-[60px]">
      <ManageRecordHeader recordType={recordType} disabled={isDisabled} />

      <div className="mb-8 flex w-[1135px] flex-col items-start gap-6">
        <div className="flex items-center justify-between self-stretch">
          <h3 className="text-heading-24 text-gray-black">총 {totalCount}명의 학생 등록</h3>
          <SearchBar
            recordType={recordType}
            grades={grades}
            classNumbers={classNumbers}
            onFiltersChange={handleFiltersChange}
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="mb-80 flex w-[1135px] flex-col items-start">
        <ManageRecordDashboardHeader recordType={recordType} />

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
        ) : totalCount === 0 ? (
          <div className="flex w-full items-center justify-center py-8">
            <div className="text-gray-black">등록된 학생이 없습니다.</div>
          </div>
        ) : (
          <>
            {allRecords.map((record: Records, index: number) => {
              const isLast = index === allRecords.length - 1;

              return (
                <RecordRow
                  key={record.recordId}
                  record={record}
                  forwardRef={isLast ? lastRecordElementRef : undefined}
                  isEditing={editingRecordId === record.recordId}
                  onEditingChange={handleEditingChange}
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
