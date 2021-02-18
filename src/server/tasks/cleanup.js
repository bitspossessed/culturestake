import Queue from 'bull';

import processor from '~/server/tasks/processor';
import { allTasks } from '~/server/tasks/';
import { redisUrl, redisLongRunningOptions } from '~/server/services/redis';

const cleanup = new Queue('Clean up queues', redisUrl, {
  settings: redisLongRunningOptions,
});

processor(cleanup).process(async () => {
  return await Promise.all([
    cleanup.clean(0),
    ...allTasks.map((queue) => queue.clean(1000, 'completed')),
  ]);
});

export default cleanup;
