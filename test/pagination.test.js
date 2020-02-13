import httpStatus from 'http-status';

import createSupertest from './helpers/supertest';
import users from './data/users';

describe('Pagination', () => {
  let authRequest;
  let createdUsers = [];

  beforeAll(async () => {
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

        if (results[0].username !== users.default.username) {
          throw new Error('Wrong pagination results');
        }

        if (pagination.orderKey !== 'username' || pagination.limit !== 1) {
          throw new Error('Wrong pagination info data');
        }

        if (results.length !== 1) {
          throw new Error('Wrong number of resources in response');
        }
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

        if (
          results[0].username !== users.lisa.username ||
          results[1].username !== users.hanna.username
        ) {
          throw new Error('Wrong pagination results');
        }

        if (
          pagination.orderDirection !== 'desc' ||
          pagination.limit !== 2 ||
          pagination.offset !== 1
        ) {
          throw new Error('Wrong pagination info data');
        }

        if (results.length !== 2) {
          throw new Error('Wrong number of resources in response');
        }
      });
  });
});
