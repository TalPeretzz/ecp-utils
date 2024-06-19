import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Histogram } from 'prom-client';
import { tap } from 'rxjs';
import { HttpMetricsModuleToken } from './http-metrics.module-definition';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(@Inject(HttpMetricsModuleToken) private readonly histogram: Histogram) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const startTime = performance.now();

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const reply = context.switchToHttp().getResponse<FastifyReply>();

    return next.handle().pipe(
      tap({
        next: () => {
          this.handleNext(request, reply, startTime);
        },
        error: (error) => {
          this.handleError(request, reply, startTime, error);
        },
      }),
    );
  }

  /**
   * Returns the endpoint of the request by replacing the values of the params with the param name
   * @example  /user/123 -> /user/:id
   */
  private getEndpoint(request: FastifyRequest) {
    return Object.entries(request.params as object).reduce(
      (acc, [key, value]) => acc.replace(value, `:${key}`),
      request.originalUrl,
    );
  }

  private handleNext(request: FastifyRequest, reply: FastifyReply, startTime: number) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    this.histogram.observe({ endpoint: this.getEndpoint(request), status: reply.statusCode }, responseTime);
  }

  private handleError(request: FastifyRequest, reply: FastifyReply, startTime: number, error: HttpException | Error) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    this.histogram.observe(
      {
        endpoint: this.getEndpoint(request),
        status: error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      },
      responseTime,
    );
  }
}
