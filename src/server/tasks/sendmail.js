import Queue from 'bull';

import processor from '~/server/tasks/processor';
import { isDev } from '~/common/utils/constants';
import { redisUrl, redisLongRunningOptions } from '~/server/services/redis';
import mailer, {
  prodTransporter,
  devTransporter,
} from '~/server/services/mailer';
import submitJob from '~/server/tasks/submitJob';

const mailing = new Queue('Send mails', redisUrl, {
  settings: redisLongRunningOptions,
});

processor(mailing).process(
  async ({ data: { to, subject, template, data = {} } }) => {
    const send = mailer(isDev ? devTransporter : prodTransporter);
    return send(to, subject, template, data);
  },
);

export const testEmail = (to = 'me@example.org', data = { name: 'Meesix' }) =>
  submitJob(mailing, {
    subject: 'Testing the email sending',
    template: 'test',
    to,
    data,
  });

export default mailing;
