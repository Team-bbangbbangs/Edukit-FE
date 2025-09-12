import { RECORD_TYPE_TITLES } from '@/domains/record/constants/record-type';
import { type RecordType } from '@/domains/record/types/record';

interface ManageRecordDashboardHeaderProps {
  recordType: RecordType;
}

export default function ManageRecordDashboardHeader({
  recordType,
}: ManageRecordDashboardHeaderProps) {
  return (
    <div className="flex items-center self-stretch bg-gray-1">
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
        <span className="text-label-16 text-gray-4">{RECORD_TYPE_TITLES[recordType]}</span>
      </div>
    </div>
  );
}
