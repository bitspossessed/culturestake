import { DataTypes } from 'sequelize';

import db from '~/server/database';

const FestivalArtwork = db.define(
  'festivals2artworks',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    festivalId: {
      type: DataTypes.INTEGER,
    },
    artworkId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  },
);

export default FestivalArtwork;
