import createSupertest from './supertest';

export async function put(path, body) {
  const authRequest = await createSupertest();
  const response = await authRequest.put(path).send(body);
  return response.body.data;
}
