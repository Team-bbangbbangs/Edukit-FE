// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn:
    process.env.NODE_ENV === 'production'
      ? 'https://5a894f88a9fbcee243831931c2d46e16@o4509864907571200.ingest.us.sentry.io/4509864915304448'
      : undefined, // 개발 환경에서는 비활성화

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 1 : 0,

  // Enable logs to be sent to Sentry
  enableLogs: process.env.NODE_ENV === 'production',

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
