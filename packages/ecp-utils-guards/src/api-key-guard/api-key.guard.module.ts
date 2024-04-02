import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  ApiKeyAsyncOptionsType,
  ApiKeyModuleToken,
  ApiKeyOptionsType,
  ConfigurableModuleClass,
} from './api-key.module-definition';
import { ApiKeyStrategy } from './api-key.strategy';

@Module({
  providers: [ApiKeyStrategy],
})
export class ApiKeyGuardModule extends ConfigurableModuleClass {
  static register(options: ApiKeyOptionsType): DynamicModule {
    return {
      module: ApiKeyGuardModule,
      providers: [{ provide: ApiKeyModuleToken, useValue: options }],
      exports: [ApiKeyGuardModule],
    };
  }

  static registerAsync(options: ApiKeyAsyncOptionsType): DynamicModule {
    return {
      module: ApiKeyGuardModule,
      providers: [...this.createApiKeyProviders(options)],
    };
  }

  private static createApiKeyProviders(options: ApiKeyAsyncOptionsType): Provider[] {
    return [
      {
        provide: ApiKeyModuleToken,
        useFactory: options.useFactory,
        inject: options.inject,
      },
    ];
  }
}
