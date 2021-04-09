import cleanup from '~/server/tasks/cleanup';
import mailing from '~/server/tasks/sendmail';
import sendTransaction from '~/server/tasks/sendTransaction';

export const allTasks = [cleanup, mailing, sendTransaction];

export default {
  cleanup,
  mailing,
  sendTransaction,
};
