import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

import db from '~/server/database';

const Question = db.define('question', {
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
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  festivalId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  artworkId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

SequelizeSlugify.slugifyModel(Question, {
  source: ['title'],
});

export default Question;
