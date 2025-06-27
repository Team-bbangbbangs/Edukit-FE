import type { AiResponseData, RecordType } from '@/types/api/student-record';
import { calculateByte } from '@/util/calculate-byte';

interface AiResponseProps {
  responses: AiResponseData | null;
  isGenerating: boolean;
  recordType: RecordType;
}

export default function AiResponse({ responses, isGenerating, recordType }: AiResponseProps) {
  const getContentForVersion = (version: number) => {
    if (isGenerating) {
      return '생성 중입니다...';
    }

    if (!responses) {
      return '프롬프트를 입력하고 생성 버튼을 눌러주세요.';
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
      <div className="relative">
        <h4 className="mb-2 font-bold">(버전 1)</h4>
        <div className="min-h-40 rounded-lg border border-slate-400 p-5">
          <p className={`whitespace-pre-wrap ${getTextColor()}`}>{getContentForVersion(1)}</p>
        </div>
        <span className="absolute bottom-1 right-2 text-slate-400">
          {getTextLength(1)}/{recordType === 'career' ? '2100' : '1500'}
        </span>
      </div>

      <div className="relative">
        <h4 className="mb-2 font-bold">(버전 2)</h4>
        <div className="min-h-40 rounded-lg border border-slate-400 p-5">
          <p className={`whitespace-pre-wrap ${getTextColor()}`}>{getContentForVersion(2)}</p>
        </div>
        <span className="absolute bottom-1 right-2 text-slate-400">
          {getTextLength(2)}/{recordType === 'career' ? '2100' : '1500'}
        </span>
      </div>

      <div className="relative">
        <h4 className="mb-2 font-bold">(버전 3)</h4>
        <div className="min-h-40 rounded-lg border border-slate-400 p-5">
          <p className={`whitespace-pre-wrap ${getTextColor()}`}>{getContentForVersion(3)}</p>
        </div>
        <span className="absolute bottom-1 right-2 text-slate-400">
          {getTextLength(3)}/{recordType === 'career' ? '2100' : '1500'}
        </span>
      </div>
    </div>
  );
}
