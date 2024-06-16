import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import * as avsc from 'avsc';
import { PUBSUB_CONTROLLER_KEY } from './pubsub-controller.decorator';
import { HandlerConfig, PUBSUB_MESSAGE_HANDLER_KEY } from './pubsub-message-handler.decorator';
import { PUBSUB_MODULE_OPTIONS_TOKEN } from './pubsub.constants';
import { PubSubModuleOptions } from './pubsub.module';

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

  public async publishMessage(
    topicNameOrId: string,
    data: unknown,
    schema?: string,
    attributes?: Record<string, string>,
  ) {
    try {
      const topic = this.pubsub.topic(topicNameOrId);

      if (schema) {
        const type = avsc.parse(schema) as avsc.Type;
        const buffer = type.toBuffer(data);

        return topic.publishMessage({ data: buffer, attributes });
      }

      return topic.publishMessage({
        data: Buffer.from(JSON.stringify(data)),
        attributes,
      });
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

    // Default to true, so that the message is acknowledged automatically
    const autoAck = this.options.autoAck ?? true;

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
            if (config.schema) {
              const type = avsc.parse(config.schema) as avsc.Type;
              const data = type.decode(message.data);
              await instance[methodKey](data.value, message);
            } else {
              const data = JSON.parse(message.data.toString());
              await instance[methodKey](data, message);
            }
            if (autoAck) {
              message.ack();
            }
          } catch (error) {
            this.logger.error(error);
            if (autoAck) {
              message.nack();
            }
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
