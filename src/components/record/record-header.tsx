export default function RecordHeader({ title }: { title: string }) {
  return (
    <thead className="h-12 bg-slate-200 [&_th]:border-b [&_th]:border-b-slate-300">
      <tr>
        <th className="w-36 pl-5 pt-1 text-left align-middle font-bold">학번</th>
        <th className="w-32 pl-5 pt-1 text-left align-middle font-bold">이름</th>
        <th className="pl-5 pt-1 text-left align-middle font-bold">{title}</th>
      </tr>
    </thead>
  );
}
