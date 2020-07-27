import { DataTypes } from 'sequelize';

import db from '~/server/database';

const Vote = db.define('vote', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  senderSignature: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  senderAddress: {
    type: DataTypes.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
  boothAddress: {
    type: DataTypes.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
  boothSignature: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  nonce: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  festivalQuestionChainId: {
    type: DataTypes.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
  festivalAnswerChainIds: {
    type: DataTypes.JSONB,
  },
  festivalVoteTokens: {
    type: DataTypes.JSONB,
  },
  artworkQuestionChainId: {
    type: DataTypes.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
  artworkAnswerChainIds: {
    type: DataTypes.JSONB,
  },
  artworkVoteTokens: {
    type: DataTypes.JSONB,
  },
});

export default Vote;
