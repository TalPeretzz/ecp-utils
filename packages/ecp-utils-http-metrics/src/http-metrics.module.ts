import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { getOrCreateMetric } from '@willsoto/nestjs-prometheus';
import { PROMETHEUS_OPTIONS } from '@willsoto/nestjs-prometheus/dist/constants';
import { HttpMetricsInterceptor } from './http-metrics.interceptor';
import { HttpMetricsMiddleware } from './http-metrics.middleware';
import {
  ConfigurableModuleClass,
  HttpMetricsModuleToken,
  HttpMetricsOptionsType,
} from './http-metrics.module-definition';

@Module({
  imports: [DiscoveryModule],
  providers: [DiscoveryService],
  exports: [DiscoveryService],
})
export class HttpMetricsModule extends ConfigurableModuleClass {
  static register(options: HttpMetricsOptionsType): DynamicModule {
    return {
      module: HttpMetricsModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: HttpMetricsModuleToken,
          useFactory: () =>
            getOrCreateMetric('Histogram', {
              name: options.name,
              help: options.help,
              labelNames: ['endpoint', 'status'],
              buckets: [1, 10, 100, 500, 1000, 5000, 10000],
            }),
          inject: [{ token: PROMETHEUS_OPTIONS, optional: true }],
        },
      ],
      exports: [
        { provide: HttpMetricsModuleToken, useValue: HttpMetricsInterceptor },
        { provide: HttpMetricsModuleToken, useValue: HttpMetricsMiddleware },
      ],
    };
  }
}
