export const API_REQUEST = Symbol('api-request');

function apiRequest(path, method = 'GET', id = null, body = null, types = {}) {
  return {
    [API_REQUEST]: {
      id,
      path,
      body,
      method,
      types,
    },
  };
}

export function putRequest({ path, body, id }, types) {
  return apiRequest(path, 'PUT', id, body, types);
}

export function getRequest({ path, params, id }, types) {
  return apiRequest(path, 'GET', id, params, types);
}

export function postRequest({ path, body, id }, types) {
  return apiRequest(path, 'POST', id, body, types);
}

export function destroyRequest({ path, body, id }, types) {
  return apiRequest(path, 'DELETE', id, body, false, types);
}
