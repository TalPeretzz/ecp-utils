import { HttpModule as NestHttpModule, HttpModuleAsyncOptions, HttpModuleOptions } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { HttpService } from './http.service';

@Module({})
export class HttpModule {
  static register(config: HttpModuleOptions): DynamicModule {
    return {
      module: HttpModule,
      imports: [NestHttpModule.register(config)],
      providers: [HttpService],
      exports: [HttpService],
    };
  }

  static registerAsync(options: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: HttpModule,
      imports: [
        ...(options.imports ?? []),
        NestHttpModule.registerAsync({
          inject: options.inject,
          useFactory: options.useFactory,
          useClass: options.useClass,
        }),
      ],
      providers: [HttpService],
      exports: [HttpService],
    };
  }
}
