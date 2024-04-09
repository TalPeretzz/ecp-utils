import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestController } from './test.controller';
import { AppController } from './app.controller';
import { PubSubModule } from '../../src';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'test/.env', isGlobal: true }),
    PubSubModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          projectId: config.get('pubsubProjectId', { infer: true }) || '',
          apiEndpoint: config.get('PUBSUB_SERVER_ENDPOINT', { infer: true }),
          init: {
            topic: 'mytopic',
            subscription: 'mysubscription',
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService, TestController],
})
export class AppModule {}
