/**
 * @see https://archive.jestjs.io/docs/en/24.x/configuration#globalsetup-string
 */
import { startPubsub } from '../test/emulators/pubsub-testcontainer';
import { StartedTestContainer } from 'testcontainers';

export = async function globalSetup() {
    // add global setup logic here

    const pubsub: StartedTestContainer = await startPubsub();
    (global as Record<string, unknown>).__PUBSUBINSTANCE = pubsub;
    process.env.PUBSUB_SERVER_ENDPOINT = `${pubsub.getHost()}:${pubsub.getMappedPort(8086)}`;
};
