/**
 * @see https://archive.jestjs.io/docs/en/24.x/configuration#globalteardown-string
 */

import { StartedTestContainer } from 'testcontainers';

export = async function globalTeardown() {
  // add global teardown logic here

  const pubsub: StartedTestContainer = (global as Record<string, unknown>).__PUBSUBINSTANCE as StartedTestContainer;
  await pubsub.stop();
};
