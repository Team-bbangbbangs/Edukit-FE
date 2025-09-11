import { useMutation } from '@tanstack/react-query';

import type { AiGenerateRequest, AiGenerateResponse } from '@/domains/record/types/record';
import { trackEvent } from '@/shared/lib/amplitude';
import { api } from '@/shared/lib/api';

export const aiGenerate = async (recordId: number, request: AiGenerateRequest) => {
  return api.post<AiGenerateResponse>(`/api/v2/student-records/ai-generate/${recordId}`, request);
};

export const useAiGenerate = () => {
  return useMutation<AiGenerateResponse, Error, { recordId: number; request: AiGenerateRequest }>({
    mutationFn: ({ recordId, request }) => aiGenerate(recordId, request),
    onSuccess: (
      _data: AiGenerateResponse,
      variables: { recordId: number; request: AiGenerateRequest },
    ) => {
      trackEvent('click_aiGenerate', {
        ai_inputLength: variables.request.prompt?.length || 0,
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
