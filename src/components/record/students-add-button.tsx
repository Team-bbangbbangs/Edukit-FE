'use client';

import { useState } from 'react';

import ExcelUploadModal from '@/components/modal/excel-upload-modal';
import { useGetRecords } from '@/hooks/api/student-manage/use-get-records';
import type { RecordType } from '@/types/record/record';
import { downloadExcel } from '@/util/download-excel';

export default function StudentAddButton({ recordType }: { recordType: RecordType }) {
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  const { data, isPending, isError } = useGetRecords(recordType);

  if (isPending || isError) {
    return null;
  }

  const hasStudents = data && data.students.length > 0;

  const handleDownloadExcel = () => {
    if (hasStudents) {
      downloadExcel(data.students, recordType);
    } else {
      alert('학생 1명 이상 필요합니다!');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setExcelModalOpen(true)}
        className="rounded-lg bg-slate-800 px-4 py-2 font-bold text-white hover:bg-slate-950"
      >
        학생 추가
      </button>

      <button
        className={`rounded-lg px-4 py-2 font-bold text-white transition-colors ${
          hasStudents ? 'bg-green-600 hover:bg-green-700' : 'cursor-not-allowed bg-gray-400'
        }`}
        onClick={handleDownloadExcel}
        disabled={!hasStudents}
      >
        엑셀로 내보내기
      </button>

      <ExcelUploadModal
        open={excelModalOpen}
        onOpenChange={setExcelModalOpen}
        recordType={recordType}
      />
    </div>
  );
}
