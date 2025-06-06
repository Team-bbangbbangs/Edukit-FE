import DownloadExcelButton from './excel-button';
import RecordBody from './record-body';
import RecordHeader from './record-header';

export default function BehaviorRecordTable() {
  return (
    <div className="relative">
      <h2 className="text-[26px] font-bold">행동특성 및 종합의견</h2>
      <table className="mt-4 w-full border-separate border-spacing-0 border border-slate-300">
        <RecordHeader title="행동특성 및 종합의견" />
        <RecordBody recordType="behavior" />
      </table>
      <DownloadExcelButton recordType="behavior" />
    </div>
  );
}
