import { ExampleV1 } from '@elementor/example-schema';
import { Message } from '@google-cloud/pubsub';
import { PubSubController, PubSubMessageHandler } from '../../src';

@PubSubController
export class TestController {
  @PubSubMessageHandler({
    subscription: 'subscription',
    schema: ExampleV1.EventEnvelopeSchema,
  })
  handle(data: ExampleV1.EventEnvelope, message: Message) {
    console.log(
      `Received message: ${message.id}, Published at: ${message.publishTime}, delivery attempt: ${message.deliveryAttempt}`,
    );
    console.log('From Pubsub Controller');
    console.log(`\tData: ${data}`);
  }
}
