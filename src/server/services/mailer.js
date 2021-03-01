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
  port: process.env.STACK_MAIL_PORT || 25,
  host: process.env.STACK_MAIL_HOST || 'localhost',
  ...(process.env.STACK_MAIL_USER && process.env.STACK_MAIL_PASSWORD
    ? {
        auth: {
          user: process.env.STACK_MAIL_USER,
          pass: process.env.STACK_MAIL_PASSWORD,
        },
      }
    : undefined),
  ...(process.env.STACK_MAIL_SECURITY === 'tls'
    ? {
        secure: true,
        tls: {
          rejectUnauthorized: false,
        },
      }
    : undefined),
  ...(process.env.STACK_MAIL_SECURITY === 'starttls'
    ? {
        secure: false,
        requireTLS: true,
        tls: {
          rejectUnauthorized: false,
        },
      }
    : undefined),
};

export const sender = process.env.STACK_MAIL_SENDER || 'meesix@example.org';

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

    const text = views[template](data);
    const msg = await transporter.sendMail({
      text,
      to,
      subject,
      from,
    });

    if (isDev) {
      logger.info(msg.envelope);
      logger.info(msg.message.toString());
    }
  };

  return send;
};
