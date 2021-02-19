import { DataTypes } from 'sequelize';

import db from '~/server/database';
import { VOTEWEIGHT_TYPES } from '~/common/helpers/validate';

const Voteweight = db.define('voteweights', {
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

export default Voteweight;
