export interface HttpExceptionOptions {
  traceIdHeader: string;
  isProd?: boolean;
  logSeverity?: 'error' | 'warn';
}
