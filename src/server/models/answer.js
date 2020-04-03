import { DataTypes } from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';

import db from '~/server/database';

import Property from '~/server/models/property';
import Artwork from '~/server/models/artwork';
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
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  chainId: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  secret: {
    type: DataTypes.STRING,
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
  artworkId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Answer.addHook('beforeCreate', async answer => {
  let model;
  let key;
  if (answer.type == 'property') {
    model = Property;
    key = answer.propertyId;
  } else {
    model = Artwork;
    key = answer.artworkId;
  }
  const link = await model.findByPk(key);
  answer.clientId = `0x${generateRandomString(64)}`;
  const { hash, secret } = await generateHashSecret(link.title);
  answer.chainId = hash;
  answer.secret = secret;
});

SequelizeSlugify.slugifyModel(Answer, {
  source: ['clientId'],
});

export default Answer;
