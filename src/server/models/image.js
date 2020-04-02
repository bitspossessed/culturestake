import { DataTypes } from 'sequelize';

import db from '~/server/database';
import { IMAGES_SUBFOLDER } from '~/server/routes/uploads';
import { removeFile } from '~/server/helpers/uploads';

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

Image.addHook('beforeDestroy', image => {
  return Promise.all([
    removeFile(image.url, IMAGES_SUBFOLDER),
    removeFile(image.urlThreshold, IMAGES_SUBFOLDER),
    removeFile(image.urlThresholdThumb, IMAGES_SUBFOLDER),
    removeFile(image.urlThumb, IMAGES_SUBFOLDER),
  ]);
});

export default Image;
