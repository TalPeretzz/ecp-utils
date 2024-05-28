import { ConfigurableModuleBuilder } from '@nestjs/common';
import { HttpExceptionOptions } from './http-exception-options';

const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<HttpExceptionOptions>()
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
  AsyncOptions as HttpExceptionAsyncOptionsType,
  MODULE_OPTIONS_TOKEN as HttpExceptionModuleToken,
  Options as HttpExceptionOptionsType,
};
