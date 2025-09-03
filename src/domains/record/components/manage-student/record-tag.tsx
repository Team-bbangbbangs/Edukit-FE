import Image from 'next/image';

import { RECORD_TYPE } from '@/domains/record/constants/record-type';
import type { RecordType } from '@/domains/record/types/record';

interface RecordTagProps {
  recordType: RecordType;
  showClose?: boolean;
  onRemove?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

const getRecordTypeStyles = (recordType: RecordType): string => {
  const styleMap: Record<RecordType, string> = {
    SUBJECT: 'bg-brandSkyblue',
    BEHAVIOR: 'bg-brandPink',
    FREE: 'bg-brandOrange',
    CAREER: 'bg-brandGreen',
    CLUB: 'bg-brandPurple',
  };

  return styleMap[recordType] || 'bg-gray-200';
};

export function RecordTag({ recordType, showClose = false, onRemove, onClick }: RecordTagProps) {
  const label = RECORD_TYPE.find((opt) => opt.value === recordType)?.label || recordType;
  const backgroundStyle = getRecordTypeStyles(recordType);

  return (
    <div
      className={`flex items-center justify-center rounded-md px-2 py-0.5 text-body-16-m text-gray-5 ${backgroundStyle} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={onClick}
    >
      <span>{label}</span>
      {showClose ? (
        <Image
          src="/svgs/ic_18_close.svg"
          alt="close"
          width={18}
          height={18}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(e);
          }}
          className="cursor-pointer hover:opacity-70"
        />
      ) : null}
    </div>
  );
}
