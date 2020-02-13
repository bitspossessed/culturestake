import httpStatus from 'http-status';
import { EmptyResultError } from 'sequelize';

import APIError from '../helpers/errors';

const DEFAULT_KEY = 'id';

export default function resourcesMiddleware(customOptions) {
  const { modelKey, paramsKey, model } = Object.assign(
    {},
    {
      modelKey: DEFAULT_KEY,
      paramsKey: DEFAULT_KEY,
    },
    customOptions,
  );

  return async (req, res, next) => {
    if (req.locals && req.locals.resource) {
      return next();
    }

    try {
      if (!paramsKey || req.query[paramsKey]) {
        throw new APIError(httpStatus.BAD_REQUEST);
      }

      const response = await model.findOne({
        rejectOnEmpty: true,
        where: {
          [modelKey]: req.params[paramsKey],
        },
      });

      if (response) {
        req.locals = req.locals || {};
        req.locals.resource = response;

        next();
      } else {
        throw new APIError(httpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof EmptyResultError) {
        next(new APIError(httpStatus.NOT_FOUND));
      } else {
        next(error);
      }
    }
  };
}
