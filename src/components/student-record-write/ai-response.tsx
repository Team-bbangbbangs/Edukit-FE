const responses = [1, 2, 3];

export default function AiResponse({ selectedId }: { selectedId: number }) {
  return (
    <div className="flex flex-col gap-10">
      {responses.map((version) => (
        <div key={version} className="relative">
          <h4 className="mb-2 font-bold">(버전 {version})</h4>
          <div className="min-h-40 rounded-lg border border-slate-400 p-5">
            <p className="text-slate-400">(이곳에 결과물 표시)</p>
          </div>
          <span className="absolute bottom-1 right-2 text-slate-400">1000/1500</span>
        </div>
      ))}
    </div>
  );
}
