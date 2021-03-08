import logger from '~/server/helpers/logger';
import { isTest } from '~/common/utils/constants';

// The default job options don't work very well during unit tests. Jobs don't
// complete in time. We will use these default job options only if we are not in
// a test environment.
const jobDefaultOptions = {
  timeout: 1000 * 60 * 40,
  attempts: 100,
  removeOnComplete: true,
  backoff: { type: 'fixed', delay: 1000 * 10 },
};

export default function submitJob(queue, id, data = {}, jobOptions = {}) {
  return queue.getJob(id).then((job) => {
    if (job) {
      logger.warn(`Job "${queue.name}" with id "${id}" is already running`);
      return;
    }

    logger.info(`Adding job "${queue.name}" with id "${id}"`);

    return queue.add(
      { id, ...data },
      { jobId: id, ...(isTest ? {} : jobDefaultOptions), ...jobOptions },
    );
  });
}
