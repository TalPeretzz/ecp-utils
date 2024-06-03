import { ArgumentsHost, Catch, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { FastifyReply } from 'fastify';
import { HttpExceptionModuleToken, HttpExceptionOptionsType } from './http-exception.module-definition';

@Catch()
export class EcpHttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(EcpHttpExceptionFilter.name);

  constructor(@Inject(HttpExceptionModuleToken) private readonly options: HttpExceptionOptionsType) {
    super();
    if (this.options.sentryOptions) {
      this.logger.debug(this.options.sentryOptions, 'Initializing Sentry');
      Sentry.init(this.options.sentryOptions);
    }
  }

  serializeResponse(exceptionResponse: string | object, statusCode: number, traceId: string) {
    if (typeof exceptionResponse === 'string') {
      return {
        message: exceptionResponse,
        statusCode,
        traceId,
      };
    }
    if (typeof exceptionResponse === 'object') {
      return {
        ...exceptionResponse,
        statusCode,
        traceId,
      };
    }
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      return super.catch(exception, host);
    }

    const response = host.switchToHttp().getResponse<FastifyReply>();
    const traceId = response.getHeader(this.options.traceIdHeader) as string;

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error';

    if (status < HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger[this.options.logSeverity ?? 'error'](exception);
    } else {
      this.logger.error({ err: exception, shouldTriggerAlert: true });

      if (this.options.sentryOptions) {
        Sentry.withScope((scope) => {
          scope.setTag('traceId', traceId);
          Sentry.captureException(exception);
        });
      }
    }

    return response.status(status).send(this.serializeResponse(exceptionResponse, status, traceId));
  }
}
