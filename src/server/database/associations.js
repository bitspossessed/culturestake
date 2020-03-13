import Answer from '~/server/models/answer';
import Property from '~/server/models/property';
import Artwork from '~/server/models/artwork';

Artwork.hasMany(Answer);
Property.hasMany(Answer);

Answer.belongsTo(Artwork, {
  allowNull: true,
});
Answer.belongsTo(Property, {
  allowNull: true,
});
