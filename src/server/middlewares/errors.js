import httpStatus from 'http-status';
import { isCelebrateError as isValidationError } from 'celebrate';

import APIError from '~/server/helpers/errors';
import logger from '~/server/helpers/logger';
import { respondWithError } from '~/server/helpers/respond';

// eslint-disable-next-line no-unused-vars
export default function errorsMiddleware(err, req, res, next) {
  // Check if error is public facing and known to us
  if (isValidationError(err)) {
    const { details } = err;

    logger.debug(details);

    // Show validation errors to user
    err = new APIError(httpStatus.BAD_REQUEST);

    if (details) {
      err.data = {
        fields: details.forEach((det) => {
          return {
            path: det.path,
            message: det.message,
          };
        }),
      };
    }
  } else if (
    !(err instanceof APIError) ||
    (!err.isPublic && process.env.NODE_ENV === 'production')
  ) {
    // Log error message internally ..
    if (err.code) {
      const message = err.message || httpStatus[err.code];
      logger.error(`${message} ${err.code} ${err.stack}`);
    } else {
      logger.error(err.stack);
    }

    // .. and expose generic message to public
    err = new APIError(httpStatus.INTERNAL_SERVER_ERROR);
  }

  // Respond with error message and status
  respondWithError(
    res,
    {
      code: err.code,
      message: err.message || httpStatus[err.code],
      ...err.data,
    },
    err.code,
  );
}
