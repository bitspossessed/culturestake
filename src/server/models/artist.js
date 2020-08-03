import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

import db from '~/server/database';

const Artist = db.define('artist', {
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
  bio: {
    type: DataTypes.STRING(2000),
    allowNull: true,
  },
  consentToDataReveal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: false,
  },
  url: {
    type: DataTypes.STRING,
  },
});

SequelizeSlugify.slugifyModel(Artist, {
  source: ['name'],
});

export default Artist;
