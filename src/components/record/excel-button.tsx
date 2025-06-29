'use client';

import { useGetRecords } from '@/hooks/api/use-get-records';
import type { RecordType } from '@/types/api/student-record';
import { downloadExcel } from '@/util/download-excel';

export default function ExcelButton({ recordType }: { recordType: RecordType }) {
  const { data, isPending, isError } = useGetRecords(recordType);

  if (isPending || isError || !data || data.students.length === 0) return null;

  return (
    <button
      className="fixed bottom-10 right-10 rounded-full bg-green-600 px-6 py-2 font-bold text-white shadow-xl hover:bg-green-500"
      onClick={() => downloadExcel(data.students, recordType)}
    >
      엑셀로 내보내기
    </button>
  );
}
