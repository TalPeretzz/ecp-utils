# Elementor PubSub Client
This module provides google pubsub publishing / handling capabilities
using Avro schemas.

## Installation
```shell
npm i @elementor/ecp-pubsub
```

## Configuration
You can configure the module like this:
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PubsubModule } from '@elementor/ecp-pubsub';
import { TestController } from './test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    PubsubModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          projectId: config.get('pubsubProjectId', { infer: true }),
          apiEndpoint: config.get('pubsubEndpoint', { infer: true }),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, TestController],
})
export class AppModule {}
```

## Usage
### Publishing messages
To publish a message you should use PubsubService provided by the module:
```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PubsubService } from '@elementor/ecp-pubsub';
import { EventEnvelope, PocV1 } from '@elementor/pubsub-avro-schema-poc';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pubsubService: PubsubService,
  ) {}

  @Get()
  async getHello() {
    const event: EventEnvelope = {
      metadata: {
        eventName: 'POC_CREATED',
        eventId: 'id',
      },
      poc: {
        createdBy: 'createdBy',
        id: '1',
        name: 'name',
        description: 'description',
        status: 'status',
      },
    };

    const messageId = this.pubsubService.publishMessage(
      'mytopic',
      event,
      PocV1.EventEnvelopeSchema,
    );

    console.log(`Avro message ${messageId} published.`);

    return this.appService.getHello();
  }
}
```

### Receiving a message
To receive a message you should annotate the receiving class as "PubsubController"
and annotate the handler as "PubsubMessageHandler". 
The handler decorator expects schema and subscription name configuration.

```ts
import { PubsubMessageHandler } from '@elementor/ecp-pubsub';
import { PubsubController } from '@elementor/ecp-pubsub';
import { PocV1 } from "@elementor/pubsub-avro-schema-poc";

@PubsubController
export class TestController {
  @PubsubMessageHandler({
    subscription: 'mysubscription',
    schema: PocV1.EventEnvelopeSchema,
  })
  handle(data: PocV1.EventEnvelope) {
    console.log('From Pubsub Controller');
    console.log(`\tData: ${data}`);
  }
}
```