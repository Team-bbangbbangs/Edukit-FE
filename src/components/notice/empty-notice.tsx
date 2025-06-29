import { BadgeAlert } from 'lucide-react';

export default function EmptyNotice() {
  return (
    <div className="mt-40 flex flex-col items-center justify-center gap-4">
      <BadgeAlert width={40} height={40} />
      <p className="text-[24px] font-bold">아직 작성된 공지사항이 없습니다.</p>
    </div>
  );
}
