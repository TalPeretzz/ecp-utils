import { DynamicModule, Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
import {
  ConfigurableModuleClass,
  HttpExceptionAsyncOptionsType,
  HttpExceptionModuleToken,
  HttpExceptionOptionsType,
} from './http-exception.module-definition';

@Module({})
export class HttpExceptionModule extends ConfigurableModuleClass {
  static register(options: HttpExceptionOptionsType): DynamicModule {
    return {
      module: HttpExceptionModule,
      providers: [
        { provide: HttpExceptionModuleToken, useValue: options },

        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
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
        useClass: HttpExceptionFilter,
      },
    ];
  }
}
