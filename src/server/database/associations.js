import Document from '~/server/models/document';
import Festival from '~/server/models/festival';
import Image from '~/server/models/image';

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
