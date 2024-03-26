import { Module } from '@nestjs/common';
import { HttpModule } from '../../src/http.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { HttpModuleOptions } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'test/.env', isGlobal: true }),
    HttpModule.registerAsync({
      inject: [ConfigService],
      imports: [],
      useFactory: (configService: ConfigService): HttpModuleOptions => {
        return {
          maxRedirects: 11,
          baseURL: configService.get('baseURL') || '',
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppAsyncModule {}
