import parameterize from '~/utils/parameterize';

const DEFAULT_METHOD = 'GET';

export default async function request(customOptions) {
  const {
    body,
    endpoint,
    headers = {},
    isTrailingSlash = true,
    path,
  } = customOptions;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const options = {
    method: customOptions.method || DEFAULT_METHOD,
    headers: new Headers({
      ...defaultHeaders,
      ...headers,
    }),
  };

  // Format the body depending on our request method
  let paramsStr = '';

  if (body) {
    if (options.method === 'GET') {
      paramsStr = parameterize(body);
    } else {
      options.body = JSON.stringify(body);
    }
  }

  // Prepare the request url and add an trailing slash when necessary
  const slash = isTrailingSlash ? '/' : '';
  const url = `${endpoint}/${path.join('/')}${slash}${paramsStr}`;

  // Do the actual request
  const response = await window.fetch(url, options);

  // Prepare some meta information for further debugging
  const meta = {
    options: {
      ...options,
      url,
    },
    status: response.status,
  };

  // Read response body and return it
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    const json = await response.json();

    return {
      ...json,
      meta,
    };
  }

  return response.body;
}
