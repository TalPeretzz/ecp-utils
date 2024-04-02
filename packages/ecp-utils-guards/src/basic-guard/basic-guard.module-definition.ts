import { ConfigurableModuleBuilder } from '@nestjs/common';
import { BasicGuardModuleOptions } from './basic.options';

const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<BasicGuardModuleOptions>()
    .setExtras({ isGlobal: false }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .build();

type Options = typeof OPTIONS_TYPE;
type AsyncOptions = Omit<typeof ASYNC_OPTIONS_TYPE, 'provideInjectionTokensFrom' | 'useClass' | 'useExisting'> &
  Required<Pick<typeof ASYNC_OPTIONS_TYPE, 'useFactory'>>;

export {
  AsyncOptions as BasicAsyncOptionsType,
  MODULE_OPTIONS_TOKEN as BasicModuleToken,
  Options as BasicOptionsType,
  ConfigurableModuleClass,
};
