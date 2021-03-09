import { DataTypes } from 'sequelize';

import db from '~/server/database';

const VoteVoteweight = db.define(
  'votes2voteweights',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    voteweightId: {
      type: DataTypes.INTEGER,
    },
    voteId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  },
);

export default VoteVoteweight;
