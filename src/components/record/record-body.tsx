'use client';

import { useState } from 'react';

import { useGetRocord } from '@/hooks/api/use-get-record';
import type { RecordType } from '@/types/api/student-record';

import EmptyRecord from './empty-record';
import RecordDetailAdd from './record-detail-add';
import RecordDetailEdit from './record-detail-edit';
import RecordDetailView from './record-detail-view';

export default function RecordBody({ recordType }: { recordType: RecordType }) {
  const { data, isPending, isError } = useGetRocord(recordType);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      {data?.map((record) =>
        editingId === record.id ? (
          <RecordDetailEdit
            key={record.id}
            record={record}
            recordType={recordType}
            onView={() => setEditingId(null)}
          />
        ) : (
          <RecordDetailView
            key={record.id}
            record={record}
            onEdit={() => setEditingId(record.id)}
          />
        ),
      )}
      {editingId === 'plus' ? (
        <RecordDetailAdd recordType={recordType} onView={() => setEditingId(null)} />
      ) : (
        <tr>
          <td
            onClick={() => setEditingId('plus')}
            colSpan={3}
            className="py-3 text-center hover:bg-slate-300"
          >
            + 추가하기
          </td>
        </tr>
      )}
    </tbody>
  );
}
