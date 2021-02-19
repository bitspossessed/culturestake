import Sequelize from 'sequelize';

import config from '~/server/database/config';
import logger from '~/server/helpers/logger';

export default new Sequelize(config.url, {
  dialect: config.dialect,
  logging: (msg) => {
    logger.debug(msg);
  },
});

Sequelize.postgres.DECIMAL.parse = function (value) {
  return parseFloat(value);
};
