export const API_REQUEST = Symbol('api-request');

function apiRequest(
  path,
  method = 'GET',
  id = null,
  body = null,
  isResponseKept = false,
  types = {},
) {
  return {
    [API_REQUEST]: {
      id,
      isResponseKept,
      path,
      body,
      method,
      types,
    },
  };
}

export function putRequest({ path, body, id, isResponseKept }, types) {
  return apiRequest(path, 'PUT', id, body, isResponseKept, types);
}

export function getRequest({ path, params, id, isResponseKept }, types) {
  return apiRequest(path, 'GET', id, params, isResponseKept, types);
}

export function postRequest({ path, body, id, isResponseKept }, types) {
  return apiRequest(path, 'POST', id, body, isResponseKept, types);
}

export function destroyRequest({ path, body, id }, types) {
  return apiRequest(path, 'DELETE', id, body, false, types);
}
