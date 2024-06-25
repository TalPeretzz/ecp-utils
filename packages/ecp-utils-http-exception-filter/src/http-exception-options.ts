import { NodeOptions } from '@sentry/node';

export interface HttpExceptionOptions {
  traceIdHeader: string;
  service: string;
  isProd?: boolean;
  logSeverity?: 'error' | 'warn';
  sentryOptions?: NodeOptions;
}
