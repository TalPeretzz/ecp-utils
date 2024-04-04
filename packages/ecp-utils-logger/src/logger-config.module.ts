import { DynamicModule, Module, Provider } from '@nestjs/common';

import { ConfigurableModuleClass, LoggerAsyncOptionsType, LoggerModuleToken } from './logger.module-definition';
import { LoggerOptionsModule } from './logger.options';
import { LoggerUtils } from './logger.utils';
@Module({
  providers: [LoggerUtils],
  exports: [LoggerUtils],
})
export class LoggerConfigModule extends ConfigurableModuleClass {
  static register(options: LoggerOptionsModule): DynamicModule {
    return {
      imports: [LoggerUtils],
      module: LoggerConfigModule,
      providers: [
        {
          provide: LoggerModuleToken,
          useValue: options,
        },
        {
          provide: LoggerModuleToken,
          useValue: options,
        },
      ],
    };
  }
  static registerAsync(options: LoggerAsyncOptionsType): DynamicModule {
    return {
      module: LoggerConfigModule,
      providers: [
        ...this.createApiKeyProviders(options),
        LoggerUtils,
        {
          provide: LoggerModuleToken,
          useValue: options,
        },
      ],
    };
  }

  private static createApiKeyProviders(options: LoggerAsyncOptionsType): Provider[] {
    return [
      {
        provide: LoggerModuleToken,
        useFactory: options.useFactory,
        inject: options.inject,
      },
    ];
  }
}
