import { DataTypes } from 'sequelize';

import db from '~/server/database';

const Invitation = db.define('invitation', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  booth: {
    type: DataTypes.STRING,
    validate: {
      isAlphanumeric: true,
    },
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  boothSignature: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isAlphanumeric: true,
    },
  },
  nonce: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  festivalSlug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  festivalQuestionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  festivalAnswerIds: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  organisationId: {
    type: DataTypes.INTEGER,
  },
});

export default Invitation;
