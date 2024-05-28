import { Inject, Injectable } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { Params } from 'nestjs-pino';
import pino from 'pino';
import { PrettyOptions } from 'pino-pretty';
import { LoggerModuleToken, LoggerOptionsType } from './logger.module-definition';
import { TRACE_ID_HEADER } from './logger.options';

@Injectable()
export class LoggerUtils {
  constructor(@Inject(LoggerModuleToken) public readonly options: LoggerOptionsType) {
    this.loggerCustomProps = this.loggerCustomProps.bind(this);
    this.serializeRequest = this.serializeRequest.bind(this);
  }

  public transport(): pino.LoggerOptions['transport'] {
    if (!this.options.loggerPretty || this.options.logEnvironment === 'production') {
      return;
    }

    const options: PrettyOptions = {
      singleLine: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:dd/mm/yyyy, hh:MM:ss TT',
    };

    return {
      target: 'pino-pretty',
      options,
    };
  }

  public redact(): pino.LoggerOptions['redact'] {
    return this.options.loggerRedactedFields;
  }

  public loggerFormatters(): pino.LoggerOptions['formatters'] {
    return {
      level: (label) => ({ level: label }),
    };
  }

  public loggerSerializers(): pino.LoggerOptions['serializers'] {
    return {
      req: this.serializeRequest,
      res: this.serializeResponse,
      err: pino.stdSerializers.err,
    };
  }

  public serializeRequest(req: pino.SerializedRequest) {
    return {
      id: req.id,
      method: req.method,
      url: req.url,
      ip: this.getClientIP(req),
      query: req.query,
      'user-agent': req.headers['user-agent'],
    };
  }

  public serializeResponse(res: pino.SerializedResponse) {
    return {
      statusCode: res.raw.statusCode,
    };
  }

  public getClientIP(req: pino.SerializedRequest): string {
    const { headers, remoteAddress } = req;
    const cfConnectingIP = headers['cf-connecting-ip'];
    const xRealIP = headers['x-real-ip'];
    const xForwardedFor = headers['x-forwarded-for'];

    return cfConnectingIP || xForwardedFor || xRealIP || remoteAddress;
  }

  public loggerCustomMessage(req: IncomingMessage, res: ServerResponse): string {
    return `${req.method} ${req.url} - ${res.statusCode}`;
  }

  public loggerExclude(): Params['exclude'] {
    return this.options.traceExcludedRoutes;
  }

  public loggerCustomProps(req: IncomingMessage, res: ServerResponse) {
    return {
      traceId: res.getHeader(TRACE_ID_HEADER),
    };
  }
}
