import httpStatus from 'http-status';
import { UniqueConstraintError } from 'sequelize';

import APIError from '../helpers/errors';

import {
  filterResponse,
  filterResponseAll,
  respondWithSuccess,
} from '../helpers/respond';

const DEFAULT_LIMIT = 20;
const DEFAULT_ORDER_DIRECTION = 'asc';
const DEFAULT_ORDER_KEY = 'id';

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
    const {
      limit = DEFAULT_LIMIT,
      offset = 0,
      orderDirection = DEFAULT_ORDER_DIRECTION,
      orderKey = DEFAULT_ORDER_KEY,
    } = req.query;

    try {
      const response = await options.model.findAndCountAll({
        limit,
        offset,
        order: [[orderKey, orderDirection.toUpperCase()]],
      });

      respondWithSuccess(res, {
        results: filterResponseAll(response.rows, options.fields),
        pagination: {
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          orderDirection,
          orderKey,
          total: response.count,
        },
      });
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
        individualHooks: true,
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
