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

export function filterResponse(response, schema) {
  const data = response.toJSON();

  return Object.keys(data).reduce((acc, key) => {
    if (schema.includes(key)) {
      acc[key] = data[key];
    }

    return acc;
  }, {});
}

export function filterResponseAll(arr, schema) {
  return arr.map(data => {
    return filterResponse(data, schema);
  });
}
