import { Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { PUBSUB_CONTROLLER_KEY } from './pubsub-controller.decorator';
import { HandlerConfig, PUBSUB_MESSAGE_HANDLER_KEY } from './pubsub-message-handler.decorator';
import { PubSubModuleOptions } from './pubsub.module';
import * as avsc from 'avsc';
import { PUBSUB_MODULE_OPTIONS_TOKEN } from './pubsub.constants';

@Injectable()
export class PubSubService implements OnApplicationBootstrap, OnApplicationShutdown {
  private pubsub: PubSub;
  private subscriptions: Subscription[] = [];
  private logger = new Logger(PubSubService.name);

  public constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
    @Inject(PUBSUB_MODULE_OPTIONS_TOKEN) private readonly options: PubSubModuleOptions,
  ) {}

  public async publishMessage(topicNameOrId: string, data: object, schema: string) {
    try {
      const topic = this.pubsub.topic(topicNameOrId);
      const type = avsc.parse(schema) as avsc.Type;
      const buffer = type.toBuffer(data);

      return topic.publishMessage({ data: buffer });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async onApplicationBootstrap() {
    this.pubsub = new PubSub({
      apiEndpoint: this.options.apiEndpoint,
      projectId: this.options.projectId,
    });

    if (this.options.init) {
      const [topic] = await this.pubsub.createTopic(this.options.init.topic);
      await topic.createSubscription(this.options.init.subscription);
    }

    // Setup by discovery
    const providers = this.discoveryService.getProviders();
    providers.forEach((wrapper) => {
      const { instance } = wrapper;
      const prototype = instance && Object.getPrototypeOf(instance);
      if (!instance || !prototype) {
        return;
      }

      const isPubsubController = this.reflector.get(PUBSUB_CONTROLLER_KEY, instance.constructor) ?? false;
      if (!isPubsubController) {
        return;
      }

      const methodKeys = this.metadataScanner.getAllMethodNames(prototype);
      methodKeys.forEach((methodKey) => {
        const config: HandlerConfig = this.reflector.get(PUBSUB_MESSAGE_HANDLER_KEY, instance[methodKey]);
        if (config === undefined) {
          return;
        }

        let subscription: Subscription;
        try {
          subscription = this.pubsub.subscription(config.subscription);
        } catch (error) {
          this.logger.error(error);
          throw error;
        }

        this.subscriptions.push(subscription);

        // eslint-disable-next-line  @typescript-eslint/no-misused-promises
        subscription.on('message', async (message: Message) => {
          try {
            const type = avsc.parse(config.schema) as avsc.Type;
            const data = type.decode(message.data);
            await instance[methodKey](data.value);
            message.ack();
          } catch (error) {
            this.logger.error(error);
            message.nack();
          }
        });
      });
    });
  }

  async onApplicationShutdown() {
    for (const subscription of this.subscriptions) {
      await subscription.close();
    }
    await this.pubsub.close();
  }
}
