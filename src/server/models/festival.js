import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

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
});

SequelizeSlugify.slugifyModel(Festival, {
  source: ['title'],
});

export default Festival;
