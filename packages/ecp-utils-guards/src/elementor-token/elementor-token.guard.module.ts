import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  ElementorTokenAsyncOptionsType,
  ElementorTokenModuleToken,
  ElementorTokenOptionsType,
} from './elementor-token.module-definition';
import { ElementorTokenStrategy } from './elementor-token.strategy';
@Module({
  providers: [ElementorTokenStrategy],
})
export class ElementorTokenGuardModule extends ConfigurableModuleClass {
  static register(options: ElementorTokenOptionsType): DynamicModule {
    return {
      module: ElementorTokenGuardModule,
      providers: [{ provide: ElementorTokenModuleToken, useValue: options }],
    };
  }

  static registerAsync(options: ElementorTokenAsyncOptionsType): DynamicModule {
    return {
      module: ElementorTokenGuardModule,
      providers: [...this.createBasicProviders(options)],
    };
  }

  private static createBasicProviders(options: ElementorTokenAsyncOptionsType): Provider[] {
    return [
      {
        provide: ElementorTokenModuleToken,
        useFactory: options.useFactory,
        inject: options.inject,
      },
    ];
  }
}
