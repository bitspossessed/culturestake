import httpStatus from 'http-status';

import createSupertest from './helpers/supertest';
import users from './data/users';
import { initializeDatabase } from './helpers/database';

describe('GET /<resource> readAll with pagination', () => {
  let authRequest;
  let createdUsers = [];

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
  });

  beforeEach(async () => {
    createdUsers = [];

    await Promise.all(
      [users.hanna, users.lisa, users.petra].map(async user => {
        return await authRequest
          .put('/api/users')
          .send(user)
          .expect(httpStatus.CREATED)
          .then(response => {
            createdUsers.push(response.body.data);
          });
      }),
    );
  });

  afterEach(async () => {
    await Promise.all(
      [users.hanna, users.lisa, users.petra].map(async user => {
        return await authRequest
          .del(`/api/users/${user.username}`)
          .expect(httpStatus.NO_CONTENT);
      }),
    );
  });

  it('should paginate response', async () => {
    await authRequest
      .get('/api/users')
      .query({ limit: 1, orderKey: 'username' })
      .expect(httpStatus.OK)
      .expect(response => {
        const { results, pagination } = response.body.data;

        expect(results.length).toBe(1);
        expect(results[0].username).toBe(users.default.username);
        expect(pagination.orderKey).toBe('username');
        expect(pagination.orderDirection).toBe('asc');
        expect(pagination.limit).toBe(1);
      });

    await authRequest
      .get('/api/users')
      .query({
        limit: 2,
        offset: 1,
        orderKey: 'username',
        orderDirection: 'desc',
      })
      .expect(httpStatus.OK)
      .expect(response => {
        const { results, pagination } = response.body.data;

        expect(results.length).toBe(2);
        expect(results[0].username).toBe(users.lisa.username);
        expect(results[1].email).toBe(users.hanna.email);
        expect(pagination.orderKey).toBe('username');
        expect(pagination.orderDirection).toBe('desc');
        expect(pagination.limit).toBe(2);
        expect(pagination.offset).toBe(1);
      });
  });
});
