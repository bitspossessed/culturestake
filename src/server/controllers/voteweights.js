import Voteweight from '~/server/models/voteweight';
import baseController from '~/server/controllers';
import { voteweightFields } from '~/server/database/associations';
import { locationFilter } from '~/server/helpers/filters';

const options = {
  model: Voteweight,
  fields: [...voteweightFields],
  customFilter: locationFilter,
};

function create(req, res, next) {
  baseController.create(options)(req, res, next);
}

function readAll(req, res, next) {
  baseController.readAll({
    ...options,
    where: req.locals && req.locals.query,
  })(req, res, next);
}

function read(req, res, next) {
  baseController.read(options)(req, res, next);
}

function destroy(req, res, next) {
  baseController.destroy(options)(req, res, next);
}

export default {
  create,
  read,
  readAll,
  destroy,
};
