import { SetMetadata } from '@nestjs/common';

export const PUBSUB_MESSAGE_HANDLER_KEY = 'PUBSUB_MESSAGE_HANDLER_KEY';
export type HandlerConfig = {
  subscription: string;
  schema: string;
};
export const PubSubMessageHandler = (config: HandlerConfig) => SetMetadata(PUBSUB_MESSAGE_HANDLER_KEY, config);
