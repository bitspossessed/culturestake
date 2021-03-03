import cleanup from '~/server/tasks/cleanup';
import mailing from '~/server/tasks/sendmail';

export const allTasks = [cleanup, mailing];

export default {
  cleanup,
  mailing,
};
