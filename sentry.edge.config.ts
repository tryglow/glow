import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://7692c634bc39f7547219a818a58e7c58@o29305.ingest.us.sentry.io/4508239475703808',

  tracesSampleRate: 1.0,
});
