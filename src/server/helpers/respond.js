import httpStatus from 'http-status';

function respond(res, status, data, code) {
  res.status(code).json({
    status,
    ...data,
  });
}

export function respondWithSuccess(res, data, status = httpStatus.OK) {
  respond(res, 'ok', { data }, status);
}

export function respondWithError(
  res,
  data,
  code = httpStatus.INTERNAL_SERVER_ERROR,
) {
  respond(res, 'error', data, code);
}
