import Sequelize from 'sequelize';

import config from './config';
import logger from '../helpers/logger';

export default new Sequelize(config.url, {
  dialect: config.dialect,
  logging: msg => {
    logger.debug(msg);
  },
});
