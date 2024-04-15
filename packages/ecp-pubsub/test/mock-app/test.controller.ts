import { ExampleV1 } from '@elementor/example-schema';
import { PubSubController, PubSubMessageHandler } from '../../src';

@PubSubController
export class TestController {
  @PubSubMessageHandler({
    subscription: 'subscription',
    schema: ExampleV1.EventEnvelopeSchema,
  })
  handle(data: ExampleV1.EventEnvelope) {
    console.log('From Pubsub Controller');
    console.log(`\tData: ${data}`);
  }
}
