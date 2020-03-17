import { DataTypes } from 'sequelize';

import db from '~/server/database';

const Document = db.define('document', {
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
});

export default Document;
