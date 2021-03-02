import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

import db from '~/server/database';
import { generateHashSecret } from '~/server/services/crypto';

const Festival = db.define('festival', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
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
  slug: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  online: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    default: false,
  },
  sticker: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
  },
});

SequelizeSlugify.slugifyModel(Festival, {
  source: ['title'],
});

Festival.addHook('beforeCreate', async (festival) => {
  const { hash, secret } = generateHashSecret(festival.title);
  festival.chainId = hash;
  festival.secret = secret;
});

export default Festival;
