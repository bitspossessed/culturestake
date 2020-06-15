import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';
import { generateHashSecret } from '~/server/services/crypto';

import db from '~/server/database';


const Festival = db.define('festival', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chainId: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
});

SequelizeSlugify.slugifyModel(Festival, {
  source: ['title'],
});

Festival.addHook('beforeCreate', async festival => {
  const { hash } = generateHashSecret(festival.title);
  festival.chainId = hash;
});

export default Festival;
