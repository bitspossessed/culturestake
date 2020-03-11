import { DataTypes } from 'sequelize';

import db from '~/server/database';

const File = db.define('file', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
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

export default File;
