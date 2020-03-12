import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

import db from '~/server/database';
import Answer from '~/server/models/answer';

const Artwork = db.define('artwork', {
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

Artwork.hasMany(Answer);

SequelizeSlugify.slugifyModel(Artwork, {
  source: ['title'],
});

export default Artwork;
