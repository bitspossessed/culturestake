import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

import db from '~/server/database';

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
  },
  description: {
    type: DataTypes.STRING(2000),
    allowNull: true,
  },
  artistId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

SequelizeSlugify.slugifyModel(Artwork, {
  source: ['title'],
});

export default Artwork;
