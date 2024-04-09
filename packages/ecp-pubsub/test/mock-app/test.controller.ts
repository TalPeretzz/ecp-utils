import { PocV1 } from '@elementor/pubsub-avro-schema-poc';
import { PubSubController, PubSubMessageHandler } from '../../src';

@PubSubController
export class TestController {
  @PubSubMessageHandler({
    subscription: 'mysubscription',
    schema: PocV1.EventEnvelopeSchema,
  })
  handle(data: PocV1.EventEnvelope) {
    console.log('From Pubsub Controller');
    console.log(`\tData: ${data}`);
  }
}
