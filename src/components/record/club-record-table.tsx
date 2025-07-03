import RecordBody from './record-body';
import RecordHeader from './record-header';
import StudentAddButton from './students-add-button';

export default function ClubRecordTable() {
  return (
    <div className="relative mb-24">
      <div className="flex justify-between">
        <h2 className="text-[26px] font-bold">창의적 체험 활동 - 동아리</h2>
        <StudentAddButton recordType="club" />
      </div>
      <table className="mt-4 w-full border-separate border-spacing-0 border border-slate-300">
        <RecordHeader title="창의적 체험 활동 - 동아리" />
        <RecordBody recordType="club" />
      </table>
    </div>
  );
}
