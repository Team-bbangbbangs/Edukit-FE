export default function EmptyRecord() {
  return (
    <>
      <p className="text-[20px] font-bold">아직 등록된 생활기록부가 없어요</p>
      <button className="rounded-lg bg-slate-800 px-10 py-4 text-[20px] font-bold text-white hover:bg-slate-950">
        학생 등록하고
        <br /> 생활기록부 관리하기
      </button>
    </>
  );
}
