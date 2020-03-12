import Answer from '~/server/models/answer';
import Property from '~/server/models/property';
import Artwork from '~/server/models/artwork';
import {
  generateRandomString,
  generateHashSecret,
} from '~/server/services/crypto';

Artwork.hasMany(Answer);
Property.hasMany(Answer);

Answer.belongsTo(Artwork, {
  allowNull: true,
});
Answer.belongsTo(Property, {
  allowNull: true,
});

Answer.addHook('beforeCreate', async answer => {
  console.log('hook')
  let model;
  let key;
  if (answer.type == 'property') {
    model = Property;
    key = answer.propertyId;
  } else {
    model = Artwork;
    key = answer.artworkId;
  }
  const link = await model.findById(key);
  console.log(link)
  answer.clientId = generateRandomString(32);
  const { hash, secret } = await generateHashSecret(link.title);
  answer.chainId = hash;
  answer.secret = secret;
});
