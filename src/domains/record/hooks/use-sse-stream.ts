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
  const currentTaskIdRef = useRef<string | null>(null);

  const clearData = useCallback(() => {
    setStreamingData(null);
    setError(null);
    isCompletedRef.current = false;
  }, []);

  const closeConnection = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.removeEventListener('ai-message', handleSseMessage);
      eventSourceRef.current.onopen = null;
      eventSourceRef.current.onerror = null;
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const handleSseMessage = useCallback(
    (event: MessageEvent) => {
      if (currentTaskIdRef.current !== taskId) {
        return;
      }

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
    [taskId, closeConnection],
  );

  const handleSseError = useCallback(() => {
    if (isCompletedRef.current || currentTaskIdRef.current !== taskId) {
      return;
    }

    setError('연결 오류가 발생했습니다.');
    closeConnection();
  }, [taskId, closeConnection]);

  const handleSseOpen = useCallback(() => {
    if (currentTaskIdRef.current === taskId) {
      setIsConnected(true);
      setError(null);
      isCompletedRef.current = false;
    }
  }, [taskId]);

  const buildSseUrl = useCallback((taskId: string): string => {
    const isMock = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';
    const endpoint = `/api/v2/student-records/stream/${taskId}`;

    if (isMock) return endpoint;
    return `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  }, []);

  const connect = useCallback(
    (taskId: string) => {
      closeConnection();
      clearData();

      currentTaskIdRef.current = taskId;

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
    [closeConnection, clearData, buildSseUrl, handleSseMessage, handleSseOpen, handleSseError],
  );

  useEffect(() => {
    if (taskId && taskId !== currentTaskIdRef.current) {
      connect(taskId);
    } else if (!taskId && currentTaskIdRef.current) {
      closeConnection();
      clearData();
      currentTaskIdRef.current = null;
    }

    return () => {
      if (!taskId) {
        closeConnection();
        currentTaskIdRef.current = null;
      }
    };
  }, [taskId, connect, closeConnection, clearData]);

  useEffect(() => {
    return () => {
      closeConnection();
      currentTaskIdRef.current = null;
    };
  }, [closeConnection]);

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
    clearData,
  };
};
