import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

import db from '~/server/database';
import { generateRandomString } from '~/server/services/crypto';

const BARCODE_LENGTH = 8;

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
  barcode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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

Artwork.addHook('beforeCreate', async (artwork) => {
  artwork.barcode = generateRandomString(BARCODE_LENGTH);
});

export default Artwork;
