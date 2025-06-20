'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useGetRecords } from '@/hooks/api/use-get-records';
import type { RecordType } from '@/types/api/student-record';

import EmptyRecord from './empty-record';
import RecordDetailAdd from './record-detail-add';
import RecordDetailEdit from './record-detail-edit';
import RecordDetailView from './record-detail-view';

export default function RecordBody({ recordType }: { recordType: RecordType }) {
  const { data, isPending, isError, isUnauthorized, isNotFound } = useGetRecords(recordType);
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
  } else if (isUnauthorized) {
    content = (
      <>
        <p className="text-[20px] font-bold">로그인이 필요합니다.</p>
        <Link
          href="/login"
          className="rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-950"
        >
          로그인
        </Link>
      </>
    );
  } else if (isNotFound) {
    content = <EmptyRecord recordType={recordType} />;
  } else if (isError || !data) {
    content = <p className="text-[20px] font-bold">데이터를 불러오는 데 실패했습니다.</p>;
  } else if (data.students.length === 0) {
    content = <EmptyRecord recordType={recordType} />;
  }

  if (content) {
    return <tbody>{renderTableRow(content)}</tbody>;
  }

  return (
    <tbody className="[&_td]:border-b [&_td]:border-b-slate-300 [&_tr:last-child_td]:border-b-0">
      {data?.students.map((record) =>
        editingId === record.recordDetailId ? (
          <RecordDetailEdit
            key={record.recordDetailId}
            record={record}
            recordType={recordType}
            onView={() => setEditingId(null)}
          />
        ) : (
          <RecordDetailView
            key={record.recordDetailId}
            record={record}
            onEdit={() => setEditingId(record.recordDetailId)}
          />
        ),
      )}
      {editingId === 'plus' ? (
        <RecordDetailAdd recordType={recordType} onCancel={() => setEditingId(null)} />
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
