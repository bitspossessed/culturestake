import { DataTypes } from 'sequelize';

import db from '~/server/database';

export const VOTEWEIGHT_TYPES = ['location', 'hotspot', 'organisation'];

const Voteweights = db.define('voteweights', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  festivalId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  strength: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: VOTEWEIGHT_TYPES,
  },
  location: {
    type: DataTypes.GEOGRAPHY('POINT', 4326),
    allowNull: true,
  },
  radius: {
    type: DataTypes.DECIMAL(13, 2),
    allowNull: true,
  },
  organisationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  hotspot: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Voteweights;
