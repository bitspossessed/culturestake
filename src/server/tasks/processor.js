import logger from '~/server/helpers/logger';

export default function processor(queue) {
  queue.on('error', (error) => {
    logger.error(`ERROR "${queue.name}" job: ${error}`);

    // eslint-disable-next-line
    console.error(error);
  });

  queue.on('active', (job) => {
    logger.info(`[${job.id}] ACTIVE "${queue.name}" job started`);
  });

  queue.on('progress', (job, progress) => {
    logger.info(`[${job.id}]" PROGRESS ${queue.name}" job: ${progress}`);
  });

  queue.on('completed', (job) => {
    logger.info(`[${job.id}] COMPLETE "${queue.name}" job`);
  });

  queue.on('failed', (job, error) => {
    logger.warn(`[${job.id}] FAILED "${queue.name}": ${error}`);

    // eslint-disable-next-line
    console.error(error);
  });

  queue.on('stalled', (job) => {
    logger.info(`[${job.id}] STALLED "${queue.name}"`);
  });

  queue.on('cleaned', (jobs, type) => {
    logger.info(`"${queue.name}" cleaned ${type} ${jobs.length}`);
  });

  queue.on('paused', () => {
    logger.info(`"${queue.name}" queue paused`);
  });

  queue.on('resumed', () => {
    logger.info(`"${queue.name}" queue resumed`);
  });

  return queue;
}
