import httpStatus from 'http-status';
import { UniqueConstraintError } from 'sequelize';

import APIError from '../helpers/errors';

import {
  filterResponse,
  filterResponseAll,
  respondWithSuccess,
} from '../helpers/respond';

function create(options) {
  return async (req, res, next) => {
    try {
      const response = await options.model.create(req.body);

      respondWithSuccess(
        res,
        filterResponse(response, options.fields),
        httpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        next(new APIError(httpStatus.CONFLICT));
      } else {
        next(error);
      }
    }
  };
}

function readAll(options) {
  return async (req, res, next) => {
    try {
      const response = await options.model.findAndCountAll();
      respondWithSuccess(res, filterResponseAll(response.rows, options.fields));
    } catch (error) {
      next(error);
    }
  };
}

function read(options) {
  return async (req, res, next) => {
    try {
      respondWithSuccess(
        res,
        filterResponse(req.locals.resource, options.fields),
      );
    } catch (error) {
      next(error);
    }
  };
}

function update(options) {
  return async (req, res, next) => {
    try {
      await options.model.update(req.body, {
        where: {
          id: req.locals.resource.id,
        },
      });

      respondWithSuccess(res, null, httpStatus.NO_CONTENT);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        next(new APIError(httpStatus.CONFLICT));
      } else {
        next(error);
      }
    }
  };
}

function destroy(options) {
  return async (req, res, next) => {
    try {
      await options.model.destroy({
        where: {
          id: req.locals.resource.id,
        },
      });

      respondWithSuccess(res, null, httpStatus.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  };
}

export default {
  create,
  read,
  readAll,
  update,
  destroy,
};
