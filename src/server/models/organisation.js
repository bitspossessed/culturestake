import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

import db from '~/server/database';

const Organisation = db.define('organisation', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(2000),
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
  },
});

SequelizeSlugify.slugifyModel(Organisation, {
  source: ['name'],
});

export default Organisation;
