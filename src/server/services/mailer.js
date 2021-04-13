import nodemailer from 'nodemailer';

import logger from '~/server/helpers/logger';
import { isDev } from '~/common/utils/constants';
import { compileAll } from '~/server/helpers/templates';

const views = compileAll('src/server/emails');

export const devTransporter = {
  streamTransport: true,
  newline: 'unix',
  buffer: true,
};

export const prodTransporter = {
  port: process.env.STAKE_MAIL_PORT || 25,
  host: process.env.STAKE_MAIL_HOST || 'localhost',
  ...(process.env.STAKE_MAIL_USER && process.env.STAKE_MAIL_PASSWORD
    ? {
        auth: {
          user: process.env.STAKE_MAIL_USER,
          pass: process.env.STAKE_MAIL_PASSWORD,
        },
      }
    : undefined),
  ...(process.env.STAKE_MAIL_SECURITY === 'tls'
    ? {
        secure: true,
        tls: {
          rejectUnauthorized: false,
        },
      }
    : undefined),
  ...(process.env.STAKE_MAIL_SECURITY === 'starttls'
    ? {
        secure: false,
        requireTLS: true,
        tls: {
          rejectUnauthorized: false,
        },
      }
    : undefined),
};

export const sender = process.env.STAKE_MAIL_SENDER || 'meesix@example.org';

export default (transport, from = sender) => {
  const transporter = nodemailer.createTransport(transport);

  const send = async (to, subject, template, data = {}) => {
    if (!views[template]) {
      logger.error(`Template ${template} not available.`);
      throw new Error(`Template ${template} not available.`);
    }

    if (!to || !subject) {
      logger.error('Recipient or subject not set.');
      throw new Error('Recipient or subject not set.');
    }

    const html = views[template](data);
    const msg = await transporter.sendMail({
      html,
      to,
      subject,
      from,
    });

    if (isDev) logger.info(msg.message.toString());
  };

  return send;
};
