import { RECORD_TYPE } from '@/domains/record/constants/record-type';
import type { RecordType } from '@/domains/record/types/record';
import { Icons } from '@/shared/components/ui/icon/icon';

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
        <Icons.Close
          size={18}
          color="text-gray-4"
          hoverColor="text-gray-black"
          className="ml-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(e);
          }}
        />
      ) : null}
    </div>
  );
}
