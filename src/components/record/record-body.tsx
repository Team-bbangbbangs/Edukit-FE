'use client';

import { useState } from 'react';

import NotAuthorizedError from '@/components/error/not-authorized-error';
import NotPermissionError from '@/components/error/not-permission-error';
import Loading from '@/components/loading/loading';
import { useGetRecords } from '@/hooks/api/student-manage/use-get-records';
import type { RecordType } from '@/types/api/student-record';

import RecordDetailAdd from './record-detail-add';
import RecordDetailEdit from './record-detail-edit';
import RecordDetailView from './record-detail-view';

export default function RecordBody({ recordType }: { recordType: RecordType }) {
  const { data, isPending, isError, isUnauthorized, isNotFound, isNotPermission } =
    useGetRecords(recordType);
  const [editingId, setEditingId] = useState<string | null>(null);

  const renderTableRow = (content: React.ReactNode) => (
    <tr>
      <td colSpan={3}>
        <div className="flex flex-col items-center justify-center gap-4 py-10">{content}</div>
      </td>
    </tr>
  );

  if (isNotFound) {
    return (
      <tbody className="[&_td]:border-b [&_td]:border-b-slate-300 [&_tr:last-child_td]:border-b-0">
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

  let content: React.ReactNode;
  if (isPending) {
    content = <Loading />;
  } else if (isUnauthorized) {
    content = <NotAuthorizedError />;
  } else if (isNotPermission) {
    content = <NotPermissionError />;
  } else if (isError || !data) {
    content = <p className="text-[20px] font-bold">데이터를 불러오는 데 실패했습니다.</p>;
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
