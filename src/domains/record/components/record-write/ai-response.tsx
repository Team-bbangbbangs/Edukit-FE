import { useEffect, useMemo, useState } from 'react';

import { useSseStream } from '@/domains/record/hooks/use-sse-stream';
import { calculateByte } from '@/domains/record/utils/calculate-byte';
import { Icons } from '@/shared/components/ui/icon/icon';

interface AiResponseProps {
  taskId: string | null;
  isGenerating: boolean;
  bytesLimit: number;
  onGenerationComplete?: () => void;
}

export default function AiResponse({
  taskId,
  isGenerating,
  bytesLimit,
  onGenerationComplete,
}: AiResponseProps) {
  const { streamingData, error, setCompletionCallback } = useSseStream(taskId);
  const [copiedVersions, setCopiedVersions] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCompletionCallback(onGenerationComplete || null);
  }, [onGenerationComplete, setCompletionCallback]);

  const isLoading = useMemo(() => {
    if (!isGenerating) return false;
    if (!streamingData) return true;

    return !streamingData.isComplete;
  }, [isGenerating, streamingData]);

  const versionsContent = useMemo(() => {
    return [1, 2, 3].map((version) => {
      if (error) {
        return {
          content: (
            <div className="flex flex-col gap-2">
              <p className="text-body-18-m text-red-600">에러가 발생했습니다: {error}</p>
            </div>
          ),
          textLength: 0,
        };
      }

      if (isLoading && streamingData) {
        const versionContent = streamingData.versions.find((v) => v.version === version);
        const latestProgress =
          streamingData.progressMessages[streamingData.progressMessages.length - 1];

        if (versionContent) {
          const textLength = calculateByte(versionContent.content) || 0;
          return {
            content: versionContent.content,
            textLength,
          };
        }

        return {
          content: (
            <div className="flex flex-col" data-testid="ai-loading">
              <span className="text-shimmer text-body-18-m">{latestProgress || '생성 중...'}</span>
            </div>
          ),
          textLength: 0,
        };
      }

      if (!streamingData) {
        return {
          content: '학생 특성 기입란을 입력하고 생성 버튼을 눌러주세요.',
          textLength: 0,
        };
      }

      const versionContent = streamingData.versions.find((v) => v.version === version);
      const content = versionContent?.content || '';
      const textLength = calculateByte(content) || 0;

      return {
        content,
        textLength,
      };
    });
  }, [error, isLoading, streamingData]);

  const textColor = useMemo(() => {
    if (streamingData) {
      return 'text-gray-black';
    }
    return 'text-gray-4';
  }, [streamingData]);

  const bgColor = useMemo(() => {
    if (streamingData) {
      return 'bg-white';
    }
    return 'bg-gray-1';
  }, [streamingData]);

  const handleCopy = async (content: string, version: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedVersions((prev) => new Set(prev).add(version));

    setTimeout(() => {
      setCopiedVersions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(version);
        return newSet;
      });
    }, 3000);
  };

  const renderVersion = (version: number) => {
    const versionData = versionsContent[version - 1];
    const isLoadingState =
      isLoading && (typeof versionData.content !== 'string' || versionData.textLength === 0);
    const canCopy = streamingData && typeof versionData.content === 'string' && versionData.content;
    const isCopied = copiedVersions.has(version);

    return (
      <div key={version} className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-title-20 text-gray-black">버전 {version}</h4>
        </div>
        <div
          className={`relative min-h-[230px] rounded-[20px] border border-gray-2 px-6 pb-10 pt-6 text-body-18-m ${
            isLoadingState ? '' : 'whitespace-pre-wrap'
          } ${bgColor} ${textColor}`}
          data-testid={`ai-response-version-${version}`}
        >
          {versionData.content}
          {canCopy ? (
            <button
              onClick={() => handleCopy(versionData.content as string, version)}
              className="absolute bottom-2 right-2 rounded-md p-1 hover:bg-gray-1"
            >
              {isCopied ? (
                <Icons.Check size={18} color="text-gray-black" />
              ) : (
                <Icons.Copy size={18} color="text-gray-4" hoverColor="text-gray-black" />
              )}
            </button>
          ) : null}
        </div>

        <div className="flex items-center justify-end self-stretch">
          <div className="flex items-start gap-[2px]">
            <span
              className={`text-body-16-r ${bytesLimit < versionData.textLength ? 'text-brandRed' : 'text-gray-4'}`}
            >
              {versionData.textLength}
            </span>
            <span className="text-body-16-r text-gray-4">/</span>
            <span className="text-body-16-r text-gray-4">{bytesLimit}</span>
            <span className="text-body-16-r text-gray-4">Bytes</span>
          </div>
        </div>
      </div>
    );
  };

  return <div className="flex w-full flex-col gap-[83px]">{[1, 2, 3].map(renderVersion)}</div>;
}
