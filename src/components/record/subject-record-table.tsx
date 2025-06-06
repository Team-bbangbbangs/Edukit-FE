import DownloadExcelButton from './excel-button';
import RecordBody from './record-body';
import RecordHeader from './record-header';

export default function SubjectRecordTable() {
  return (
    <div className="relative">
      <h2 className="text-[26px] font-bold">세부능력 및 특기사항</h2>
      <table className="mt-4 w-full border-separate border-spacing-0 border border-slate-300">
        <RecordHeader title="세부능력 및 특기사항" />
        <RecordBody recordType="subject" />
      </table>
      <DownloadExcelButton recordType="subject" />
    </div>
  );
}
