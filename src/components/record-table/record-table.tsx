'use client';

import { useGetRocord } from '@/hooks/api/use-get-record';
import type { RecordType } from '@/types/api/student-record';

export default function RecordTable({ recordType }: { recordType: RecordType }) {
  const { data, isPending, isError } = useGetRocord(recordType);

  if (isPending) {
    return <div>데이터를 불러오는 중입니다.</div>;
  }
  if (isError || !data) {
    return <div>데이터를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <table className="w-full border-separate border-spacing-0 rounded-3xl border border-slate-300">
      <thead className="h-12 [&_th]:border-b [&_th]:border-b-slate-300">
        <tr>
          <th className="w-40 pl-5 pr-2 pt-1 text-left align-middle font-bold">학번</th>
          <th className="w-40 px-2 pt-1 text-left align-middle font-bold">이름</th>
          <th className="px-2 pt-1 text-left align-middle font-bold">과세특</th>
        </tr>
      </thead>
      <tbody className="[&_td]:border-b [&_td]:border-b-slate-300 [&_tr:last-child_td]:border-b-0">
        {data?.map((record) => (
          <tr key={record.id}>
            <td className="py-2 pl-5 pr-2 align-middle">{record.studentNumber}</td>
            <td className="p-2 align-middle">{record.name}</td>
            <td className="p-2 align-middle">{record.content}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
