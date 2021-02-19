import Voteweight from '~/server/models/voteweight';
import baseController from '~/server/controllers';
import { voteweightFields } from '~/server/database/associations';
import { filterResponseFields } from '~/server/controllers';

const options = {
  model: Voteweight,
  fields: [...voteweightFields],
  customFilter: locationFilter,
};

function locationFilter(req, data) {
  const location = {
    latitude: data.dataValues.location.coordinates[0],
    longitude: data.dataValues.location.coordinates[1],
  };

  data.set('location', location, {
    raw: true,
  });

  return filterResponseFields(req, data, {
    ...options,
    associations: [],
  });
}

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
