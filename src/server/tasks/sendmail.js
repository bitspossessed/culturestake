import Queue from 'bull';

import processor from '~/server/tasks/processor';
import { isDev, isTest } from '~/common/utils/constants';
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
    const send = mailer(isDev || isTest ? devTransporter : prodTransporter);
    return send(to, subject, template, data);
  },
);

export const testEmail = (to = 'me@example.org', data = { name: 'Meesix' }) =>
  submitJob(mailing, to, {
    subject: 'Testing the email sending',
    template: 'test',
    to,
    data,
  });

export const voteInvitationEmail = (to = 'me@example.org', data = {}) =>
  submitJob(mailing, `${to}#voteInvitation`, {
    subject: 'You are invited to vote',
    template: 'vote-invitation',
    to,
    data,
  });

export const voteEmail = (to = 'me@example.org', data = {}) =>
  submitJob(mailing, `${to}#vote`, {
    subject: 'Your vote link',
    template: 'vote',
    to,
    data,
  });

export default mailing;
