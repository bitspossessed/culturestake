import db from '~/server/database';
import logger from '~/server/helpers/logger';
import tasks from '~/server/tasks';
import submitJob from '~/server/tasks/submitJob';

const CRON_NIGHTLY = '0 0 0 * * *';

// Check database connection
db.authenticate()
  .then(() => {
    logger.info('Database connection has been established successfully');
    submitJob(tasks.cleanup, 'cleanUp-nightly', null, {
      repeat: {
        cron: CRON_NIGHTLY,
      },
    });
  })
  .catch(() => {
    logger.error('Unable to connect to database');
    process.exit(1);
  });
