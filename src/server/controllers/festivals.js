import Festival from '~/server/models/festival';
import baseController from '~/server/controllers';

const options = {
  model: Festival,
  fields: ['title', 'description'],
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

function update(req, res, next) {
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
