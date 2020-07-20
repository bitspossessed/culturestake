import { DataTypes } from 'sequelize';

import Artwork from '~/server/models/artwork';
import Property from '~/server/models/property';
import db from '~/server/database';
import { generateHashSecret } from '~/server/services/crypto';

export const ANSWER_TYPES = ['property', 'artwork'];

const Answer = db.define('answer', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  chainId: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  secret: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  type: {
    type: DataTypes.ENUM,
    values: ANSWER_TYPES,
    allowNull: false,
  },
  artworkId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Answer.addHook('beforeCreate', async (answer) => {
  let model;
  let key;
  if (answer.type == 'property') {
    model = Property;
    key = answer.propertyId;
  } else {
    model = Artwork;
    key = answer.artworkId;
  }

  const link = await model.findByPk(key);
  const { hash, secret } = generateHashSecret(link.title);
  answer.chainId = hash;
  answer.secret = secret;
});

export default Answer;
