import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { PUBSUB_MODULE_OPTIONS_TOKEN } from './pubsub.constants';
import { PubSubService } from './pubsub.service';

export interface PubSubModuleOptions {
  projectId?: string;
  apiEndpoint?: string;
  /**
   * If `false`, manual acknowledgment mode enabled
   * @default true
   */
  autoAck?: boolean;
  init?: {
    topic: string;
    subscription: string;
  };
}

export interface PubSubModuleAsyncOptions {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => Promise<PubSubModuleOptions> | PubSubModuleOptions;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  inject?: any[];
}

@Module({})
export class PubSubModule {
  static register(options: PubSubModuleOptions): DynamicModule {
    return {
      module: PubSubModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: PUBSUB_MODULE_OPTIONS_TOKEN,
          useValue: options,
        },
        PubSubService,
      ],
      exports: [PubSubService],
    };
  }

  static registerAsync(options: PubSubModuleAsyncOptions): DynamicModule {
    return {
      module: PubSubModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: PUBSUB_MODULE_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        PubSubService,
      ],
      exports: [PubSubService],
    };
  }
}
