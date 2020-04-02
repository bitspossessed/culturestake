import { DataTypes } from 'sequelize';

import db from '~/server/database';
import { DOCUMENTS_SUBFOLDER } from '~/server/routes/uploads';
import { removeFile } from '~/server/helpers/uploads';

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

Document.addHook('beforeDestroy', file => {
  return removeFile(file.url, DOCUMENTS_SUBFOLDER);
});

export default Document;
