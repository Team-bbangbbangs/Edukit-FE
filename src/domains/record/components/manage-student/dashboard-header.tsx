import Image from 'next/image';

interface DashboardHeaderProps {
  isAllSelected: boolean;
  onToggleAll: () => void;
}

export function DashboardHeader({ isAllSelected, onToggleAll }: DashboardHeaderProps) {
  return (
    <div className="flex items-center self-stretch bg-gray-1">
      <div
        className="flex w-14 cursor-pointer items-center justify-center py-4"
        onClick={onToggleAll}
      >
        <Image
          src={isAllSelected ? '/svgs/ic_24_box_checked.svg' : '/svgs/ic_24_box_default.svg'}
          alt="defaultBox"
          width={24}
          height={24}
        />
      </div>
      <div className="flex w-[100px] items-center justify-center px-9 py-4">
        <span className="text-label-16 text-gray-4">학년</span>
      </div>
      <div className="flex w-[100px] items-center justify-center px-10 py-4">
        <span className="text-label-16 text-gray-4">반</span>
      </div>
      <div className="flex w-[200px] items-center justify-center px-10 py-4">
        <span className="text-label-16 text-gray-4">번호</span>
      </div>
      <div className="flex w-[140px] items-center justify-center px-10 py-4">
        <span className="text-label-16 text-gray-4">이름</span>
      </div>
      <div className="flex flex-1 items-center justify-center px-10 py-4">
        <span className="text-label-16 text-gray-4">생활기록부 관리 항목</span>
      </div>
    </div>
  );
}
