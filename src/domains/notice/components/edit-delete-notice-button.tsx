'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useDeleteAdminNotice } from '@/domains/notice/apis/mutations/use-delete-admin-notice';
import DeleteConfirmModal from '@/shared/components/ui/modal/delete-confirm-modal';
import { revalidateNotice } from '@/shared/lib/actions/revalidateNotice';
import { useAuth } from '@/shared/providers/auth-provider';

export default function EditDeleteNoticeButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  const { mutate: deleteAdminNotice } = useDeleteAdminNotice();

  const handleDelete = () => {
    deleteAdminNotice(id, {
      onSuccess: async () => {
        await revalidateNotice();
        setOpen(false);
        router.push('/notice');
      },
      onError: (error) => {
        alert(error.message);
      },
    });
  };

  return isAdmin ? (
    <div className="flex justify-end gap-2">
      <Link
        href={`/notice/edit-notice/${id}`}
        className="rounded-md bg-slate-800 px-4 pb-1.5 pt-2 text-white hover:bg-slate-950"
      >
        수정하기
      </Link>
      <button
        className="rounded-md bg-red-600 px-4 pb-1.5 pt-2 text-white hover:bg-red-700"
        onClick={() => setOpen(true)}
      >
        삭제하기
      </button>
      <DeleteConfirmModal open={open} onOpenChange={setOpen} onDelete={handleDelete} />
    </div>
  ) : null;
}
