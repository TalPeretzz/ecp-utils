import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ApiKeyGuardModuleOptions } from './api-key.options';

const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ApiKeyGuardModuleOptions>()
    .setExtras({ isGlobal: false }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .build();

type Options = typeof OPTIONS_TYPE;
type AsyncOptions = Omit<typeof ASYNC_OPTIONS_TYPE, 'provideInjectionTokensFrom' | 'useClass' | 'useExisting'> &
  Required<Pick<typeof ASYNC_OPTIONS_TYPE, 'useFactory'>>;

export {
  AsyncOptions as ApiKeyAsyncOptionsType,
  MODULE_OPTIONS_TOKEN as ApiKeyModuleToken,
  Options as ApiKeyOptionsType,
  ConfigurableModuleClass,
};
