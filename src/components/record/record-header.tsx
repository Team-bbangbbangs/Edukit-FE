export default function RecordHeader({ title }: { title: string }) {
  return (
    <thead className="h-12 [&_th]:border-b [&_th]:border-b-slate-300">
      <tr>
        <th className="w-40 pl-5 pr-2 pt-1 text-left align-middle font-bold">학번</th>
        <th className="w-40 px-2 pt-1 text-left align-middle font-bold">이름</th>
        <th className="px-2 pt-1 text-left align-middle font-bold">{title}</th>
      </tr>
    </thead>
  );
}
