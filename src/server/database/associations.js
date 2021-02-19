import Answer from '~/server/models/answer';
import Artist from '~/server/models/artist';
import Artwork from '~/server/models/artwork';
import Document from '~/server/models/document';
import Festival from '~/server/models/festival';
import FestivalArtwork from '~/server/models/festivalArtwork';
import Image from '~/server/models/image';
import Property from '~/server/models/property';
import Question from '~/server/models/question';
import Voteweight from '~/server/models/voteweight';

const attachableMixin = {
  foreignKey: 'attachableId',
  constraints: false,
};

// Public API response fields

export const answerFields = ['artworkId', 'propertyId', 'questionId'];
export const artistFields = ['bio', 'name', 'url'];
export const artworkFields = [
  'artistId',
  'barcode',
  'description',
  'descriptionCommission',
  'sticker',
  'subtitle',
  'title',
  'subtitle',
  'url',
  'documents',
  'imageCredits',
];
export const baseFileFields = ['fileName', 'fileType', 'url'];
export const festivalFields = [
  'chainId',
  'description',
  'sticker',
  'subtitle',
  'title',
  'url',
];
export const imageFileFields = [
  ...baseFileFields,
  'urlThreshold',
  'urlThresholdThumb',
  'urlThumb',
];
export const organisationFields = ['description', 'name'];
export const propertyFields = ['title'];
export const questionFields = ['title', 'chainId', 'artworkId', 'festivalId'];
export const userFields = ['username', 'email'];
export const voteweightFields = [
  'strength',
  'festivalId',
  'type',
  'radius',
  'latitude',
  'longitude',
  'hotspot',
  'organisationId',
];

// Artwork

export const ArtworkHasManyAnswers = Artwork.hasMany(Answer);

export const ArtworkBelongsToArtist = Artwork.belongsTo(Artist);

export const ArtworkHasManyQuestions = Artwork.hasMany(Question, {
  ...attachableMixin,
  foreignKey: 'artworkId',
  as: 'questions',
});

export const ArtworkBelongsToManyFestivals = Artwork.belongsToMany(Festival, {
  through: FestivalArtwork,
  as: 'festivals',
  foreignKey: 'artworkId',
  otherKey: 'festivalId',
});

export const ArtworkHasManyImages = Artwork.hasMany(Image, {
  ...attachableMixin,
  scope: {
    attachableType: 'artwork',
  },
  as: 'images',
});

export const ArtworkHasManyDocuments = Artwork.hasMany(Document, {
  ...attachableMixin,
  scope: {
    attachableType: 'artwork',
  },
  as: 'documents',
});

// Answer

export const AnswerBelongsToQuestion = Answer.belongsTo(Question);

export const AnswerBelongsToArtwork = Answer.belongsTo(Artwork, {
  allowNull: true,
});

export const AnswerBelongsToProperty = Answer.belongsTo(Property, {
  allowNull: true,
});

// Artist

export const ArtistHasManyArtworks = Artist.hasMany(Artwork, {
  ...attachableMixin,
  foreignKey: 'artistId',
  as: 'artworks',
});

export const ArtistHasManyImages = Artist.hasMany(Image, {
  ...attachableMixin,
  scope: {
    attachableType: 'artist',
  },
  as: 'images',
});

// Festival

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

export const FestivalBelongsToManyArtworks = Festival.belongsToMany(Artwork, {
  through: FestivalArtwork,
  as: 'artworks',
  foreignKey: 'festivalId',
  otherKey: 'artworkId',
});

export const FestivalHasManyVoteweights = Festival.hasMany(Voteweight, {
  ...attachableMixin,
  foreignKey: 'festivalId',
  as: 'voteweights',
});

// Property

export const PropertyHasManyAnswers = Property.hasMany(Answer);

// Question

export const QuestionBelongsToArtwork = Question.belongsTo(Artwork, {
  allowNull: true,
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
  as: 'artwork',
});

export const QuestionBelongsToFestival = Question.belongsTo(Festival, {
  allowNull: true,
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
  as: 'festival',
});

export const QuestionHasManyAnswers = Question.hasMany(Answer, {
  ...attachableMixin,
  foreignKey: 'questionId',
  as: 'answers',
});

// Voteweights

export const VoteweightBelongsToFestival = Voteweight.belongsTo(Festival);
