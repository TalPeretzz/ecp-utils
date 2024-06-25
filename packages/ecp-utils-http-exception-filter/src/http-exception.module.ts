import { DynamicModule, Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Counter } from 'prom-client';
import { EcpHttpExceptionFilter } from './http-exception.filter';
import {
  ConfigurableModuleClass,
  HttpExceptionAsyncOptionsType,
  HttpExceptionModuleToken,
  HttpExceptionOptionsType,
} from './http-exception.module-definition';

const unhandledExceptionsCounter = new Counter({
  name: 'ecp_unhandled_exceptions_count',
  help: 'Total number of unhandled exceptions in the application',
  labelNames: ['method', 'route', 'status_code', 'service'],
});

@Module({})
export class HttpExceptionModule extends ConfigurableModuleClass {
  static register(options: HttpExceptionOptionsType): DynamicModule {
    return {
      module: HttpExceptionModule,
      providers: [
        { provide: HttpExceptionModuleToken, useValue: options },
        {
          provide: APP_FILTER,
          useClass: EcpHttpExceptionFilter,
        },
        {
          provide: Counter,
          useValue: unhandledExceptionsCounter,
        },
      ],
    };
  }

  static registerAsync(options: HttpExceptionAsyncOptionsType): DynamicModule {
    return {
      module: HttpExceptionModule,
      providers: [...this.createBasicProviders(options)],
    };
  }

  private static createBasicProviders(options: HttpExceptionAsyncOptionsType): Provider[] {
    return [
      {
        provide: HttpExceptionModuleToken,
        useFactory: options.useFactory,
        inject: options.inject,
      },
      {
        provide: APP_FILTER,
        useClass: EcpHttpExceptionFilter,
      },
      {
        provide: Counter,
        useValue: unhandledExceptionsCounter,
      },
    ];
  }
}
