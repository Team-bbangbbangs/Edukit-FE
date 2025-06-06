import DownloadExcelButton from './excel-button';
import RecordBody from './record-body';
import RecordHeader from './record-header';

export default function FreeRecordTable() {
  return (
    <div className="relative">
      <h2 className="text-[26px] font-bold">창의적 체험 활동 - 자율</h2>
      <table className="mt-4 w-full border-separate border-spacing-0 border border-slate-300">
        <RecordHeader title="창의적 체험 활동 - 자율" />
        <RecordBody recordType="free" />
      </table>
      <DownloadExcelButton recordType="free" />
    </div>
  );
}
