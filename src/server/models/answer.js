import { DataTypes } from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';

import db from '~/server/database';
import {
  generateRandomString,
  generateHashSecret,
} from '~/server/services/crypto';

export const types = ['property', 'artwork'];

const Answer = db.define('answer', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: DataTypes.STRING,
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  chainId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  type: {
    type: DataTypes.ENUM,
    values: types,
    allowNull: false,
  },
});

Answer.hasOne(require('~/server/model/artwork'), {
  foreignKey: 'slug',
  allowNull: true,
});
Answer.hasOne(require('~/server/model/property'), {
  foreignKey: 'slug',
  allowNull: true,
});

SequelizeSlugify.slugifyModel(Answer, {
  source: ['clientId'],
});

Answer.addHook('beforeValidate', async (answer, options) => {
  answer.clientId = generateRandomString(32);
  answer.chainId = (await generateHashSecret(options.str)).hash;
  answer.secret = (await generateHashSecret(options.str)).secret;
});

export default Answer;
