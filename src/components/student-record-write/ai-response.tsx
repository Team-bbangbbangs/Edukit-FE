import Loading from '@/components/loading/loading';
import type { AiResponseData, RecordType } from '@/types/api/student-record';
import { calculateByte } from '@/util/calculate-byte';

interface AiResponseProps {
  responses: AiResponseData | null;
  isGenerating: boolean;
  recordType: RecordType;
}

export default function AiResponse({ responses, isGenerating, recordType }: AiResponseProps) {
  const bytesLimit = recordType === 'career' ? 2100 : 1500;

  const getContentForVersion = (version: number) => {
    if (isGenerating) {
      return (
        <div className="flex flex-col gap-2">
          <Loading />
          <p className="text-[14px] text-slate-500">20초정도 소요됩니다.</p>
        </div>
      );
    }

    if (!responses) {
      return '학생 특성 기입란을 입력하고 생성 버튼을 눌러주세요.';
    }

    const descriptions = [responses.description1, responses.description2, responses.description3];
    return descriptions[version - 1] || '';
  };

  const getTextColor = () => {
    if (responses && !isGenerating) {
      return 'text-slate-700';
    }
    return 'text-slate-400';
  };

  const getTextLength = (version: number) => {
    if (!responses) return 0;
    if (isGenerating) {
      return 0;
    }

    const descriptions = [responses.description1, responses.description2, responses.description3];
    return calculateByte(descriptions[version - 1]) || 0;
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h4 className="font-bold">(버전 1)</h4>
        <div
          className={`min-h-40 rounded-lg border border-slate-400 p-5 ${
            isGenerating ? 'flex items-center justify-center' : 'whitespace-pre-wrap'
          } ${getTextColor()}`}
        >
          {getContentForVersion(1)}
        </div>
        <div className="flex justify-end">
          <span className={`${bytesLimit < getTextLength(1) ? 'text-red-600' : 'text-slate-400'}`}>
            {getTextLength(1)}
          </span>
          <span className="text-slate-400">/{bytesLimit} Bytes</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-bold">(버전 2)</h4>
        <div
          className={`min-h-40 rounded-lg border border-slate-400 p-5 ${
            isGenerating ? 'flex items-center justify-center' : 'whitespace-pre-wrap'
          } ${getTextColor()}`}
        >
          {getContentForVersion(2)}
        </div>
        <div className="flex justify-end">
          <span className={`${bytesLimit < getTextLength(2) ? 'text-red-600' : 'text-slate-400'}`}>
            {getTextLength(2)}
          </span>
          <span className="text-slate-400">/{bytesLimit} Bytes</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-bold">(버전 3)</h4>
        <div
          className={`min-h-40 rounded-lg border border-slate-400 p-5 ${
            isGenerating ? 'flex items-center justify-center' : 'whitespace-pre-wrap'
          } ${getTextColor()}`}
        >
          {getContentForVersion(3)}
        </div>
        <div className="flex justify-end">
          <span className={`${bytesLimit < getTextLength(3) ? 'text-red-600' : 'text-slate-400'}`}>
            {getTextLength(3)}
          </span>
          <span className="text-slate-400">/{bytesLimit} Bytes</span>
        </div>
      </div>
    </div>
  );
}
