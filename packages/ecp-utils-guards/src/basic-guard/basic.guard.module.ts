import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  BasicAsyncOptionsType,
  BasicModuleToken,
  BasicOptionsType,
  ConfigurableModuleClass,
} from './basic-guard.module-definition';
import { BasicStrategy } from './basic.strategy';

@Module({
  providers: [BasicStrategy],
})
export class BasicGuardModule extends ConfigurableModuleClass {
  static register(options: BasicOptionsType): DynamicModule {
    return {
      module: BasicGuardModule,
      providers: [{ provide: BasicModuleToken, useValue: options }],
      exports: [BasicGuardModule],
    };
  }

  static registerAsync(options: BasicAsyncOptionsType): DynamicModule {
    return {
      module: BasicGuardModule,
      providers: [...this.createBasicProviders(options)],
    };
  }

  private static createBasicProviders(options: BasicAsyncOptionsType): Provider[] {
    return [
      {
        provide: BasicModuleToken,
        useFactory: options.useFactory,
        inject: options.inject,
      },
    ];
  }
}
