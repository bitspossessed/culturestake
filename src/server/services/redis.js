import redis from 'redis';

import logger from '~/server/helpers/logger';

const client = redis.createClient();

client.on('error', function (error) {
  logger.error(error);
});

export default client;

export const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const redisOptions = {
  settings: {
    lockDuration: 1000 * 30, // Key expiration time for job locks
    stalledInterval: 1000 * 30, // How often check for stalled jobs (use 0 for never checking)
    maxStalledCount: 1, // Max amount of times a stalled job will be re-processed
    guardInterval: 1000 * 5, // Poll interval for delayed jobs and added jobs
    retryProcessDelay: 1000 * 5, // delay before processing next job in case of internal error
  },
};

export const redisLongRunningOptions = {
  settings: {
    lockDuration: 1000 * 60 * 30,
    lockRenewTime: 1000 * 15,
    stalledInterval: 1000 * 60 * 1,
    maxStalledCount: 2,
    guardInterval: 1000 * 10,
    retryProcessDelay: 1000 * 15,
  },
};
