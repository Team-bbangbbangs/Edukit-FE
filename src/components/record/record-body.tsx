'use client';

import { useGetRocord } from '@/hooks/api/use-get-record';
import type { RecordType } from '@/types/api/student-record';

import EmptyRecord from './empty-record';
import RecordDetailRow from './record-detail-row';

export default function RecordBody({ recordType }: { recordType: RecordType }) {
  const { data, isPending, isError } = useGetRocord(recordType);

  const renderTableRow = (content: React.ReactNode) => (
    <tr>
      <td colSpan={3}>
        <div className="flex flex-col items-center justify-center gap-4 py-10">{content}</div>
      </td>
    </tr>
  );

  let content: React.ReactNode;
  if (isPending) {
    content = <p className="text-[20px] font-bold">데이터를 불러오는 중입니다.</p>;
  } else if (isError || !data) {
    content = <p className="text-[20px] font-bold">데이터를 불러오는 데 실패했습니다.</p>;
  } else if (data.length === 0) {
    content = <EmptyRecord recordType={recordType} />;
  }

  if (content) {
    return <tbody>{renderTableRow(content)}</tbody>;
  }

  return (
    <tbody className="[&_td]:border-b [&_td]:border-b-slate-300 [&_tr:last-child_td]:border-b-0">
      {data?.map((record) => (
        <RecordDetailRow key={record.id} record={record} recordType={recordType} />
      ))}
    </tbody>
  );
}
