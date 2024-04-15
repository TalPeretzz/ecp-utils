import { PubSubController, PubSubMessageHandler } from '../../src';

@PubSubController
export class TestController {
  @PubSubMessageHandler({
    subscription: 'subscription-without-schema',
  })
  handleWithoutSchema(data: unknown) {
    console.log('From Pubsub Controller');
    console.log(`\tData: ${data}`);
  }
}
