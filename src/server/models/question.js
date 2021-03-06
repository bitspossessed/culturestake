import SequelizeSlugify from 'sequelize-slugify';
import { DataTypes } from 'sequelize';

import { generateHashSecret } from '~/server/services/crypto';
import { QUESTION_TYPES } from '~/common/helpers/validate';
import db from '~/server/database';

const Question = db.define(
  'question',
  {
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
    slug: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    festivalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    artworkId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: QUESTION_TYPES,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['festivalId', 'type'],
        where: {
          type: 'festival',
        },
      },
    ],
  },
);

SequelizeSlugify.slugifyModel(Question, {
  source: ['title'],
});

Question.addHook('beforeCreate', async (question) => {
  const { hash, secret } = generateHashSecret(question.title);
  question.chainId = hash;
  question.secret = secret;
});

export default Question;
