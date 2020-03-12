import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

import db from '~/server/database';
import Answer from '~/server/models/answer';

const Property = db.define('property', {
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
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
});

Property.hasMany(Answer, {
  foreignKey: 'slug',
});

SequelizeSlugify.slugifyModel(Property, {
  source: ['title'],
});

export default Property;
