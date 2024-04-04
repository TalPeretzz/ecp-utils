import { Params } from 'nestjs-pino';
import pino from 'pino';

export class LoggerOptionsModule {
  logLevel: pino.LevelWithSilentOrString;
  loggerPretty: boolean;
  loggerRedactedFields: pino.LoggerOptions['redact'];
  traceExcludedRoutes: Params['exclude'];
  logEnvironment: 'development' | 'production' | 'test';
}

export const TRACE_ID_HEADER = 'X-Elementor-Trace-Id';
