import Voteweight from '~/server/models/voteweight';
import baseController from '~/server/controllers';
import { voteweightFields } from '~/server/database/associations';

const options = {
  model: Voteweight,
  fields: [...voteweightFields],
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
