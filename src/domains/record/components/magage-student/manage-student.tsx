'use client';

import { useState } from 'react';

import Image from 'next/image';

import Button from '@/shared/components/ui/button/button';
import ExcelUploadModal from '@/shared/components/ui/modal/excel-upload-modal';

export default function ManageStudent() {
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  return (
    <div className="flex w-full flex-col justify-center">
      <div className="mb-14 flex justify-between">
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
      <div className="mb-[29px] flex items-center justify-between">
        <span className="text-title-20 text-gray-4">총 20명의 학생 등록</span>
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
      <ExcelUploadModal open={excelModalOpen} onOpenChange={setExcelModalOpen} />
    </div>
  );
}
