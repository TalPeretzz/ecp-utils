import { Controller, Get } from '@nestjs/common';
import { EventEnvelope, PocV1 } from '@elementor/pubsub-avro-schema-poc';
import { PubSubService } from '../../src';

@Controller()
export class AppController {
  constructor(private readonly pubsubService: PubSubService) {}

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

    await this.pubsubService.publishMessage('mytopic', event, PocV1.EventEnvelopeSchema);

    return { success: true };
  }
}
