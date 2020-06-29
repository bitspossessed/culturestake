import Answer from '~/server/models/answer';
import Artwork from '~/server/models/artwork';
import Artist from '~/server/models/artist';
import Document from '~/server/models/document';
import Festival from '~/server/models/festival';
import Image from '~/server/models/image';
import Property from '~/server/models/property';
import Question from '~/server/models/question';

const attachableMixin = {
  foreignKey: 'attachableId',
  constraints: false,
};

export const ArtworkHasManyAnswers = Artwork.hasMany(Answer);

export const PropertyHasManyAnswers = Property.hasMany(Answer);

export const AnswerBelongsToArtwork = Answer.belongsTo(Artwork, {
  allowNull: true,
});

export const AnswerBelongsToProperty = Answer.belongsTo(Property, {
  allowNull: true,
});

export const ArtworkBelongsToArtist = Artwork.belongsTo(Artist);

export const ArtistHasManyArtworks = Artist.hasMany(Artwork, {
  ...attachableMixin,
  foreignKey: 'artistId',
  as: 'artworks',
});

export const QuestionBelongsToArtwork = Question.belongsTo(Artwork, {
  allowNull: true,
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

export const QuestionBelongsToFestival = Question.belongsTo(Festival, {
  allowNull: true,
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

export const AnswerBelongsToQuestion = Answer.belongsTo(Question);

export const FestivalHasManyImages = Festival.hasMany(Image, {
  ...attachableMixin,
  scope: {
    attachableType: 'festival',
  },
  as: 'images',
});

export const FestivalHasManyDocuments = Festival.hasMany(Document, {
  ...attachableMixin,
  scope: {
    attachableType: 'festival',
  },
  as: 'documents',
});

export const FestivalHasManyQuestions = Festival.hasMany(Question, {
  ...attachableMixin,
  foreignKey: 'festivalId',
  as: 'questions',
});

export const ArtworkHasManyQuestions = Artwork.hasMany(Question, {
  ...attachableMixin,
  foreignKey: 'artworkId',
  as: 'questions',
});

export const QuestionHasManyAnswers = Question.hasMany(Answer, {
  ...attachableMixin,
  foreignKey: 'questionId',
  as: 'answers',
});

export const ArtworkHasManyImages = Artwork.hasMany(Image, {
  ...attachableMixin,
  scope: {
    attachableType: 'artwork',
  },
  as: 'images',
});

export const ArtistHasManyImages = Artist.hasMany(Image, {
  ...attachableMixin,
  scope: {
    attachableType: 'artist',
  },
  as: 'images',
});
