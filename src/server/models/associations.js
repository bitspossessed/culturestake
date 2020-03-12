import Answer from '~/server/models/answer';
import Property from '~/server/models/property';
import Artwork from '~/server/models/artwork';

Artwork.hasMany(Answer);
Property.hasMany(Answer);

Answer.belongsTo(Artwork);
Answer.belongsTo(Property);
