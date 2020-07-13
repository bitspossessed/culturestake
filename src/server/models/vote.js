import { DataTypes } from 'sequelize';

import db from '~/server/database';

const Vote = db.define('vote', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  signature: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isAlphanumeric: true,
    },
  },
  sender: {
    type: DataTypes.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
  booth: {
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
  festivalQuestion: {
    type: DataTypes.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
  festivalAnswers: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('answers'));
    },
    set: function (val) {
      return this.setDataValue('answers', JSON.stringify(val));
    },
  },
  festivalVoteTokens: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('voteTokens'));
    },
    set: function (val) {
      return this.setDataValue('voteTokens', JSON.stringify(val));
    },
  },
  artworkQuestion: {
    type: DataTypes.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
  artworkAnswers: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('answers'));
    },
    set: function (val) {
      return this.setDataValue('answers', JSON.stringify(val));
    },
  },
  artworkVoteTokens: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('voteTokens'));
    },
    set: function (val) {
      return this.setDataValue('voteTokens', JSON.stringify(val));
    },
  },
});

export default Vote;
