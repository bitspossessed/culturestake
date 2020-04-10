import Question from '~/server/models/question';
import baseController from '~/server/controllers';
// import {
//   FestivalHasManyImages,
//   FestivalHasManyDocuments,
// } from '~/server/database/associations';

const baseFileFields = ['fileName', 'fileType', 'url'];

const options = {
  model: Question,
  fields: ['title', 'description'],
  fieldsProtected: [],
  // include: [FestivalHasManyImages, FestivalHasManyDocuments],
  // associations: [
  //   {
  //     association: FestivalHasManyImages,
  //     destroyCascade: true,
  //     fields: [
  //       ...baseFileFields,
  //       'urlThreshold',
  //       'urlThresholdThumb',
  //       'urlThumb',
  //     ],
  //   },
  //   {
  //     association: FestivalHasManyDocuments,
  //     destroyCascade: true,
  //     fields: [...baseFileFields],
  //   },
  // ],
};

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll(options)(req, res, next);
}

function read(req, res, next) {
  baseController.read(options)(req, res, next);
}

async function update(req, res, next) {
  baseController.update(options)(req, res, next);
}

function destroy(req, res, next) {
  baseController.destroy(options)(req, res, next);
}

export default {
  create,
  read,
  readAll,
  update,
  destroy,
};
