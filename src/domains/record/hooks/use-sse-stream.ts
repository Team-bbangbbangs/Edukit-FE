import { useCallback, useEffect, useRef, useState } from 'react';

import { EventSourcePolyfill } from 'event-source-polyfill';

import type { SseMessage, StreamingResponse } from '@/domains/record/types/record';
import { tokenStore } from '@/shared/lib/token-store';

export const useSseStream = (taskId: string | null) => {
  const [streamingData, setStreamingData] = useState<StreamingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const completionCallbackRef = useRef<(() => void) | null>(null);
  const isCompletedRef = useRef(false);

  const closeConnection = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const handleSseMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message: SseMessage = JSON.parse(event.data);

        setStreamingData((prev) => {
          const current = prev ?? {
            taskId: message.taskId,
            progressMessages: [],
            versions: [],
            isComplete: false,
          };

          switch (message.type) {
            case 'PROGRESS':
              if (message.data?.message && message.data?.version) {
                const newMessage = {
                  message: message.data.message,
                  version: message.data.version,
                };
                const newMessages = [...current.progressMessages, newMessage];
                return { ...current, progressMessages: newMessages };
              }
              return current;

            case 'RESPONSE':
              if (message.data?.finalContent && message.data?.version) {
                const versions = [...current.versions];
                const idx = versions.findIndex((v) => v.version === message.data.version);

                if (idx >= 0) {
                  versions[idx] = {
                    version: message.data.version,
                    content: message.data.finalContent,
                  };
                } else {
                  versions.push({
                    version: message.data.version,
                    content: message.data.finalContent,
                  });
                  versions.sort((a, b) => a.version - b.version);
                }

                const isComplete = versions.length === 3;

                if (isComplete && completionCallbackRef.current && !current.isComplete) {
                  isCompletedRef.current = true;

                  closeConnection();
                  setTimeout(() => {
                    completionCallbackRef.current?.();
                  }, 0);
                }

                return { ...current, versions, isComplete };
              }
              return current;

            default:
              return current;
          }
        });
      } catch {
        setError('메시지 파싱 오류가 발생했습니다.');
      }
    },
    [closeConnection],
  );

  const handleSseError = useCallback(() => {
    if (isCompletedRef.current) {
      return;
    }

    setError('연결 오류가 발생했습니다.');
    closeConnection();
  }, [closeConnection]);

  const handleSseOpen = useCallback(() => {
    setIsConnected(true);
    setError(null);
    isCompletedRef.current = false;
  }, []);

  const buildSseUrl = useCallback((taskId: string): string => {
    const isMock = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';
    const endpoint = `/api/v2/student-records/stream/${taskId}`;

    if (isMock) return endpoint;

    return `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  }, []);

  const connect = useCallback(
    (taskId: string) => {
      closeConnection();
      setStreamingData(null);
      setError(null);
      isCompletedRef.current = false;

      try {
        const url = buildSseUrl(taskId);
        const token = tokenStore.getToken();

        const eventSource = new EventSourcePolyfill(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          heartbeatTimeout: 300000,
          withCredentials: false,
        });

        eventSourceRef.current = eventSource;

        eventSource.onopen = handleSseOpen;
        eventSource.onerror = handleSseError;
        eventSource.addEventListener('ai-message', handleSseMessage);
      } catch {
        setError('연결을 시작할 수 없습니다.');
      }
    },
    [closeConnection, buildSseUrl, handleSseMessage, handleSseOpen, handleSseError],
  );

  useEffect(() => {
    if (taskId) {
      connect(taskId);
    } else {
      closeConnection();
      setStreamingData(null);
      setError(null);
      isCompletedRef.current = false;
    }

    return () => {
      closeConnection();
      isCompletedRef.current = false;
    };
  }, [taskId, connect, closeConnection]);

  const setCompletionCallback = useCallback((callback: (() => void) | null) => {
    completionCallbackRef.current = callback;
  }, []);

  return {
    streamingData,
    error,
    isConnected,
    connect,
    closeConnection,
    setCompletionCallback,
  };
};
