import RecordBody from './record-body';
import RecordHeader from './record-header';
import StudentAddButton from './students-add-button';

export default function BehaviorRecordTable() {
  return (
    <div className="relative mb-24">
      <div className="flex justify-between">
        <h2 className="text-[26px] font-bold">행동특성 및 종합의견</h2>
        <StudentAddButton recordType="behavior" />
      </div>
      <table className="mt-4 w-full border-separate border-spacing-0 border border-slate-300">
        <RecordHeader title="행동특성 및 종합의견" />
        <RecordBody recordType="behavior" />
      </table>
    </div>
  );
}
