import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

let pubsubContainer: StartedTestContainer | null = null;

export const startPubsub = async (): Promise<StartedTestContainer> => {
  if (pubsubContainer) {
    return pubsubContainer;
  }
  const container = await new GenericContainer('gcr.io/google.com/cloudsdktool/cloud-sdk:emulators')
    .withWaitStrategy(Wait.forAll([Wait.forListeningPorts()]))
    .withCommand(['gcloud', 'beta', 'emulators', 'pubsub', 'start', '--project=my-project', '--host-port=0.0.0.0:8086'])
    .withExposedPorts(8086)
    .start();
  pubsubContainer = container;

  return container;
};
