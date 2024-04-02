import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ElementorTokenGuardModuleOptions } from './elementor-token.options';

const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ElementorTokenGuardModuleOptions>()
    .setExtras({ isGlobal: false }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .build();

type Options = typeof OPTIONS_TYPE;
type AsyncOptions = Omit<typeof ASYNC_OPTIONS_TYPE, 'provideInjectionTokensFrom' | 'useClass' | 'useExisting'> &
  Required<Pick<typeof ASYNC_OPTIONS_TYPE, 'useFactory'>>;

export {
  ConfigurableModuleClass,
  AsyncOptions as ElementorTokenAsyncOptionsType,
  MODULE_OPTIONS_TOKEN as ElementorTokenModuleToken,
  Options as ElementorTokenOptionsType,
};
