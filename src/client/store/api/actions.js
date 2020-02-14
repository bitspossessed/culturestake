export const API_REQUEST = Symbol('api-request');

function apiRequest(path, method = 'GET', body = null, types = {}) {
  return {
    [API_REQUEST]: {
      path,
      body,
      method,
      types,
    },
  };
}

export function putRequest({ path, body }, types) {
  return apiRequest(path, 'PUT', body, types);
}

export function getRequest({ path, params }, types) {
  return apiRequest(path, 'GET', params, types);
}

export function postRequest({ path, body }, types) {
  return apiRequest(path, 'POST', body, types);
}

export function destroyRequest({ path, body }, types) {
  return apiRequest(path, 'DELETE', body, types);
}
