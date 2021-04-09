import Queue from 'bull';

import processor from '~/server/tasks/processor';
import { redisUrl, redisLongRunningOptions } from '~/server/services/redis';
import submitJob from '~/server/tasks/submitJob';
import dispatchVote from '~/server/services/dispatcher';
import logger from '~/server/helpers/logger';

const transactions = new Queue('Send transactions', redisUrl, {
  settings: redisLongRunningOptions,
});

processor(transactions).process(1, async ({ data }) => {
  try {
    const tx = await dispatchVote(data);
    logger.info(
      `Finished processing vote with transaction hash ${tx.transactionHash}`,
    );
  } catch (error) {
    logger.error(error);
    throw error;
  }
});

export const sendVoteTransaction = (data) => {
  submitJob(
    transactions,
    `${data.boothAddress}#${data.nonce}#${data.questionAddress}`,
    data,
  );
};

export default transactions;
