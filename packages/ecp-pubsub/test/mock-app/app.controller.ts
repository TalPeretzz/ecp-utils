import { EventEnvelope, ExampleV1 } from '@elementor/example-schema';
import { Controller, Get } from '@nestjs/common';
import { PubSubService } from '../../src';

@Controller()
export class AppController {
  constructor(private readonly pubsubService: PubSubService) {}

  @Get()
  async getHello() {
    const event: EventEnvelope = {
      metadata: {
        eventName: 'CREATED',
        eventId: 'id',
        eventSource: 'test',
        timestamp: 1713195615942,
      },
      example: {
        billingInfo: {
          billingId: 'id',
          billingName: 'name',
        },
        description: 'description',
        id: 'id',
        name: 'name',
        status: 'status',
        createdBy: 'createdBy',
      },
    };

    await this.pubsubService.publishMessage('topic', event, ExampleV1.EventEnvelopeSchema);

    return { success: true };
  }
}
