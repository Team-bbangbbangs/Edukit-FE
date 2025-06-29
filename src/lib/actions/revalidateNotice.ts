'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateNotice(noticeId?: string) {
  revalidatePath('/notice');
  if (noticeId) {
    revalidatePath(`/notice/${noticeId}`);
  }
}
