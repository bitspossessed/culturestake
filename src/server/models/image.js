import { DataTypes } from 'sequelize';

import db from '~/server/database';

const Image = db.define('image', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  attachableId: {
    type: DataTypes.INTEGER,
  },
  attachableType: {
    type: DataTypes.STRING,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  urlThreshold: {
    type: DataTypes.STRING,
  },
  urlThresholdThumb: {
    type: DataTypes.STRING,
  },
  urlThumb: {
    type: DataTypes.STRING,
  },
});

export default Image;
