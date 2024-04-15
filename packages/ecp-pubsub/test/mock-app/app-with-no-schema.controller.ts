import { Controller, Get } from '@nestjs/common';
import { PubSubService } from '../../src';

@Controller()
export class AppController {
  constructor(private readonly pubsubService: PubSubService) {}

  @Get()
  async testWithoutSchema() {
    const event = 'I can be anything';

    await this.pubsubService.publishMessage('topic-without-schema', event);

    return { success: true };
  }
}
