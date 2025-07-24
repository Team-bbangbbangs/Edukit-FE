import RecordBody from './record-body';
import RecordHeader from './record-header';
import StudentAddButton from './students-add-button';

export default function SubjectRecordTable() {
  return (
    <div className="relative mb-24">
      <div className="flex justify-between">
        <h2 className="text-[26px] font-bold">세부능력 및 특기사항</h2>
        <StudentAddButton recordType="subject" />
      </div>
      <table className="mt-4 w-full border-separate border-spacing-0 border border-slate-300">
        <RecordHeader title="세부능력 및 특기사항" />
        <RecordBody recordType="subject" />
      </table>
    </div>
  );
}
