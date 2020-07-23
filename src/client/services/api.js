import request from '~/client/utils/request';
import { APIError, RequestError } from '~/client/utils/errors';

export default async function apiRequest({
  path,
  method = 'GET',
  token = null,
  body = null,
}) {
  const headers = {};

  // Add JWT authorization token when given
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do the API request
  const response = await request({
    body,
    endpoint: process.env.API_ENDPOINT,
    // isTrailingSlash: false,
    headers,
    method,
    path,
  });

  // Check in the response data if an API error occurred
  if (response.status && response.status !== 'ok') {
    throw new APIError(response);
  }

  // This is not an API error but something more serious
  if (response && response.meta && response.meta.status >= 400) {
    throw new RequestError(response);
  }

  return response.data;
}
