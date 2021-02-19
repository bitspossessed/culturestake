import Organisation from '~/server/models/organisation';
import baseController from '~/server/controllers';
import {
  organisationFields,
  // imageFileFields,
} from '~/server/database/associations';

const options = {
  model: Organisation,
  fields: [...organisationFields, 'images'],
  //   include: [OrganisationHasManyImages],
  //   associations: [
  //     {
  //       association: OrganisationHasManyImages,
  //       destroyCascade: true,
  //       fields: [...imageFileFields],
  //     },
  //   ],
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
  baseController.read({
    ...options,
    // include: [OrganisationHasManyImages],
    associations: [
      {
        // association: OrganisationHasManyImages,
        destroyCascade: true,
        // fields: [...imageFileFields],
      },
    ],
  })(req, res, next);
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
