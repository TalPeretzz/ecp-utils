import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PubSubModule } from '../../src';
import { TestController } from './app-with-no-schema-test.controller';
import { AppController } from './app-with-no-schema.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'test/.env', isGlobal: true }),
    PubSubModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          projectId: config.get('PUBSUB_PROJECT_ID', { infer: true }) || '',
          apiEndpoint: config.get('PUBSUB_SERVER_ENDPOINT', { infer: true }),
          init: {
            topic: 'topic-without-schema',
            subscription: 'subscription-without-schema',
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService, TestController],
})
export class AppModule {}
