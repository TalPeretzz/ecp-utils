import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { HttpExceptionModuleToken, HttpExceptionOptionsType } from './http-exception.module-definition';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(@Inject(HttpExceptionModuleToken) private readonly options: HttpExceptionOptionsType) {}

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

  catch(exception: T, host: ArgumentsHost) {
    this.logger[this.options.logSeverity ?? 'error'](exception);

    const response = host.switchToHttp().getResponse<FastifyReply>();
    const traceId = response.getHeader(this.options.traceIdHeader) as string;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      return response
        .status(exception.getStatus())
        .send(this.serializeResponse(exceptionResponse, exception.getStatus(), traceId));
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send(this.serializeResponse('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR, traceId));
  }
}
