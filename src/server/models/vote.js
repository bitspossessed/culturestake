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
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('festivalAnswerChainIds'));
    },
    set: function (festivalAnswerChainIds) {
      return this.setDataValue(
        'festivalAnswerChainIds',
        JSON.stringify(festivalAnswerChainIds),
      );
    },
  },
  festivalVoteTokens: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('festivalVoteTokens'));
    },
    set: function (festivalVoteTokens) {
      return this.setDataValue(
        'festivalVoteTokens',
        JSON.stringify(festivalVoteTokens),
      );
    },
  },
  artworkQuestionChainId: {
    type: DataTypes.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
  artworkAnswerChainIds: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('artworkAnswerChainIds'));
    },
    set: function (artworkAnswerChainIds) {
      return this.setDataValue(
        'artworkAnswerChainIds',
        JSON.stringify(artworkAnswerChainIds),
      );
    },
  },
  artworkVoteTokens: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('artworkVoteTokens'));
    },
    set: function (artworkVoteTokens) {
      return this.setDataValue(
        'artworkVoteTokens',
        JSON.stringify(artworkVoteTokens),
      );
    },
  },
});

export default Vote;
