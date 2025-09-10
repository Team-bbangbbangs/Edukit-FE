import { RECORD_TYPE_TITLES } from '@/domains/record/constants/record-type';
import { type RecordType } from '@/domains/record/types/record';
import Button from '@/shared/components/ui/button/button';

interface ManageRecordHeaderProps {
  recordType: RecordType;
}

export default function ManageRecordHeader({ recordType }: ManageRecordHeaderProps) {
  return (
    <div className="mb-14 flex w-[1135px] items-center justify-between">
      <h2 className="text-heading-24 text-gray-black">{RECORD_TYPE_TITLES[recordType]}</h2>

      {/* 엑셀 내보내기 api 구현 후 연동 예정 */}
      <Button
        color="primary"
        variant="fill"
        size="medium"
        shape="rect"
        className="text-label-16 text-white"
      >
        엑셀로 내보내기
      </Button>
    </div>
  );
}
