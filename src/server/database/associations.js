import Answer from '~/server/models/answer';
import Property from '~/server/models/property';
import Artwork from '~/server/models/artwork';
import Document from '~/server/models/document';
import Festival from '~/server/models/festival';
import Question from '~/server/models/question';
import Image from '~/server/models/image';

Artwork.hasMany(Answer);
Property.hasMany(Answer);

Answer.belongsTo(Artwork, {
  allowNull: true,
});
Answer.belongsTo(Property, {
  allowNull: true,
});
Answer.belongsTo(Question);

const attachableMixin = {
  foreignKey: 'attachableId',
  constraints: false,
};

export const FestivalHasManyImages = Festival.hasMany(Image, {
  ...attachableMixin,
  scope: {
    attachableType: 'image',
  },
  as: 'images',
});

export const FestivalHasManyDocuments = Festival.hasMany(Document, {
  ...attachableMixin,
  scope: {
    attachableType: 'document',
  },
  as: 'documents',
});

export const QuestionHasManyAnswers = Question.hasMany(Answer, {
  ...attachableMixin,
  foreignKey: 'questionId',
  as: 'answers',
});
