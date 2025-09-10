'use client';

import { useState } from 'react';

import { useGetRecords } from '@/domains/record/apis/infinite-queries/use-get-records';
import type {
  RecordsResponse,
  Records,
  RecordsFilters,
  RecordType,
} from '@/domains/record/types/record';
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useGetRecords(filters);

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

  return (
    <div className="flex w-full flex-col justify-center p-[60px]">
      <ManageRecordHeader recordType={recordType} />

      <div className="mb-8 flex w-[1135px] flex-col items-start gap-6">
        <div className="flex items-center justify-between self-stretch">
          <h3 className="text-heading-24 text-gray-black">총 {totalCount}명의 학생 등록</h3>
          <SearchBar
            recordType={recordType}
            grades={grades}
            classNumbers={classNumbers}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>

      <div className="mb-80 flex w-[1135px] flex-col items-start">
        <ManageRecordDashboardHeader recordType={recordType} />

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
            {allRecords.map((record: Records, index: number) => {
              const isLast = index === allRecords.length - 1;

              return (
                <RecordRow
                  key={record.recordId}
                  record={record}
                  forwardRef={isLast ? lastRecordElementRef : undefined}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
