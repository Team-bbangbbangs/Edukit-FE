import { useDownloadExcel } from '@/domains/record/apis/mutations/use-get-excel';
import { RECORD_TYPE_TITLES } from '@/domains/record/constants/record-type';
import { type RecordType } from '@/domains/record/types/record';
import Button from '@/shared/components/ui/button/button';

interface ManageRecordHeaderProps {
  recordType: RecordType;
}

export default function ManageRecordHeader({ recordType }: ManageRecordHeaderProps) {
  const { mutate: downloadExcel, isPending } = useDownloadExcel();

  const handleExcelDownload = () => {
    downloadExcel(recordType);
  };

  return (
    <div className="mb-14 flex w-[1135px] items-center justify-between">
      <h2 className="text-heading-24 text-gray-black">{RECORD_TYPE_TITLES[recordType]}</h2>

      <Button
        color="primary"
        variant="fill"
        size="medium"
        shape="rect"
        className="text-label-16 text-white"
        onClick={handleExcelDownload}
        disabled={isPending}
      >
        {isPending ? '다운로드 중...' : '엑셀로 내보내기'}
      </Button>
    </div>
  );
}
