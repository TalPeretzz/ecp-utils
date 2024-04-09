import { SetMetadata } from '@nestjs/common';

export const PUBSUB_CONTROLLER_KEY = 'PUBSUB_CONTROLLER_KEY';
export const PubSubController: ClassDecorator = SetMetadata(PUBSUB_CONTROLLER_KEY, true);
