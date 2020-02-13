import httpStatus from 'http-status';
import { UniqueConstraintError } from 'sequelize';

import APIError from '../helpers/errors';
import User from '../models/user';

import {
  filterResponse,
  filterResponseAll,
  respondWithSuccess,
} from '../helpers/respond';

const RESPONSE_FIELDS = ['id', 'username', 'email'];

async function create(req, res, next) {
  try {
    const response = await User.create(req.body);

    respondWithSuccess(
      res,
      filterResponse(response, RESPONSE_FIELDS),
      httpStatus.CREATED,
    );
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      next(new APIError(httpStatus.CONFLICT));
    } else {
      next(error);
    }
  }
}

async function readAll(req, res, next) {
  try {
    const response = await User.findAndCountAll();
    respondWithSuccess(res, filterResponseAll(response.rows, RESPONSE_FIELDS));
  } catch (error) {
    next(error);
  }
}

async function read(req, res, next) {
  try {
    respondWithSuccess(
      res,
      filterResponse(req.locals.resource, RESPONSE_FIELDS),
    );
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    await User.update(req.body, {
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
}

async function destroy(req, res, next) {
  try {
    await User.destroy({
      where: {
        id: req.locals.resource.id,
      },
    });

    respondWithSuccess(res, null, httpStatus.NO_CONTENT);
  } catch (error) {
    next(error);
  }
}

export default {
  create,
  read,
  readAll,
  update,
  destroy,
};
