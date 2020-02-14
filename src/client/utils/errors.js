export default class ClientError extends Error {
  constructor(message = 'Unknown error occurred') {
    super(message);

    this.name = 'ClientError';

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export class APIError extends ClientError {
  constructor(response) {
    const { message, code, fields } = response;
    const { url, method, headers } = response.meta.options;

    super(
      `Unhandled API request error (url="${url}", code=${code}, message="${message}")`,
    );

    this.name = 'APIError';

    this.response = {
      code,
      fields,
      message,
    };

    this.request = {
      method,
      url,
      headers,
    };
  }
}

export class RequestError extends ClientError {
  constructor(response) {
    const code = response;
    const { url, method, headers, body } = response.meta.options;

    super(`Unhandled request error (url="${url}", code=${code})`);

    this.name = 'RequestError';

    this.response = {
      code,
      message: this.message,
    };

    this.request = {
      body,
      method,
      url,
      headers,
    };
  }
}
