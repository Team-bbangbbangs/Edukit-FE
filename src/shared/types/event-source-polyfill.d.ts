declare module 'event-source-polyfill' {
  export interface EventSourcePolyfillInit extends EventSourceInit {
    headers?: Record<string, string>;
    withCredentials?: boolean;

    heartbeatTimeout?: number;
    connectionTimeout?: number;
  }

  export class EventSourcePolyfill extends EventSource {
    constructor(url: string, eventSourceInitDict?: EventSourcePolyfillInit);
  }
}
