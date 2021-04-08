import redis from 'redis';

import logger from '~/server/helpers/logger';

const client = redis.createClient();

client.on('error', function (error) {
  logger.error(error);
});

export function getFromRedis(key) {
  return new Promise((res, rej) => {
    client.get(key, (err, result) => {
      if (err) rej(err);
      res(result);
    });
  });
}

export function incrementInRedis(key) {
  return new Promise((res, rej) => {
    client.incr(key, (err, result) => {
      if (err) rej(err);
      res(result);
    });
  });
}

export function setInRedis(key, value, ...opts) {
  return new Promise((res, rej) => {
    client.set(key, value, ...opts, (err, result) => {
      if (err) rej(err);
      res(result);
    });
  });
}

export function expireFromRedis(key) {
  return new Promise((res, rej) => {
    client.expire(key, 0, (err, result) => {
      if (err) rej(err);
      res(result);
    });
  });
}

export async function closeRedis() {
  await new Promise((resolve) => {
    client.quit(() => {
      resolve();
    });
  });
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise((resolve) => setImmediate(resolve));
}

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
