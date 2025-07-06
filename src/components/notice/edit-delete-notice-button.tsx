'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import DeleteConfirmModal from '@/components/modal/delete-confirm-modal';
import { useAuth } from '@/contexts/auth/use-auth';
import { useDeleteAdminNotice } from '@/hooks/api/use-delete-admin-notice';
import { revalidateNotice } from '@/lib/actions/revalidateNotice';

export default function EditDeleteNoticeButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  const { mutate: deleteAdminNotice } = useDeleteAdminNotice();

  const handleDelete = () => {
    deleteAdminNotice(
      { id },
      {
        onSuccess: async () => {
          await revalidateNotice();
          setOpen(false);
          router.push('/notice');
        },
        onError: (error) => {
          alert(error.message);
        },
      },
    );
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
