import { NodeOptions } from '@sentry/node';

export interface HttpExceptionOptions {
  traceIdHeader: string;
  isProd?: boolean;
  logSeverity?: 'error' | 'warn';
  sentryOptions?: NodeOptions;
}
