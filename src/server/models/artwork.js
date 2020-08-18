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
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  subtitle: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  descriptionCommission: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  artistId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sticker: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
  },
});

SequelizeSlugify.slugifyModel(Artwork, {
  source: ['title'],
});

Artwork.addHook('beforeCreate', async (artwork) => {
  artwork.barcode = generateRandomString(BARCODE_LENGTH);
});

export default Artwork;
