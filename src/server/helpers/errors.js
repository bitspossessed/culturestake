import httpStatus from 'http-status';

class BaseError extends Error {
  constructor(code, message, isPublic) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;

    if (code && code > 0) {
      this.code = code;
    } else {
      this.code = httpStatus.INTERNAL_SERVER_ERROR;
    }

    this.isPublic = isPublic;

    Error.captureStackTrace(this, this.constructor.name);
  }
}

export default class APIError extends BaseError {
  constructor(
    code = httpStatus.INTERNAL_SERVER_ERROR,
    message,
    isPublic = true,
  ) {
    super(code, message, isPublic);
  }
}