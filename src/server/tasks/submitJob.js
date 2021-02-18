import logger from '~/server/helpers/logger';

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
      { jobId: id, ...jobDefaultOptions, ...jobOptions },
    );
  });
}
