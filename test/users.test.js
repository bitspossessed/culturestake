import httpStatus from 'http-status';

import createSupertest from './helpers/supertest';
import users from './data/users';
import { initializeDatabase } from './helpers/database';

describe('Users', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
  });

  describe('PUT /api/users', () => {
    afterEach(async () => {
      await authRequest.del('/api/users/lisa');
    });

    it('should fail with a too short password', async () => {
      await authRequest
        .put('/api/users')
        .send({
          ...users.lisa,
          password: 'short',
        })
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should succeeed creating a new user', async () => {
      await authRequest
        .put('/api/users')
        .send(users.lisa)
        .expect(httpStatus.CREATED);
    });

    it('should fail when there is a duplicate entry', async () => {
      await authRequest
        .put('/api/users')
        .send(users.lisa)
        .expect(httpStatus.CREATED);

      await authRequest
        .put('/api/users')
        .send(users.lisa)
        .expect(httpStatus.CONFLICT);
    });
  });

  describe('GET /api/users', () => {
    let createdUsers = [];

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

    it('should return all created users', async () => {
      await authRequest
        .get('/api/users')
        .expect(httpStatus.OK)
        .expect(response => {
          const { results } = response.body.data;

          createdUsers.forEach(user => {
            const foundUser = results.find(item => item.id === user.id);

            if (!foundUser) {
              throw new Error('Missing user in response');
            }

            if (foundUser.email !== user.email) {
              throw new Error('Invalid response');
            }
          });

          if (results.length !== Object.keys(users).length) {
            throw new Error('Invalid number of users');
          }
        });
    });
  });

  describe('UPDATE /api/users', () => {
    it('should fail when user was not found', async () => {
      await authRequest
        .post('/api/users/test', {
          username: 'bla',
        })
        .expect(httpStatus.NOT_FOUND);
    });

    it('should successfully change the username and email', async () => {
      await authRequest
        .put('/api/users')
        .send(users.petra)
        .expect(httpStatus.CREATED);

      await authRequest
        .post('/api/users/petra')
        .send({
          username: 'peter',
          email: 'peter@test.com',
        })
        .expect(httpStatus.NO_CONTENT);

      await authRequest
        .get('/api/users/peter')
        .expect(httpStatus.OK)
        .expect(response => {
          const { username, email } = response.body.data;

          if (username !== 'peter' || email !== 'peter@test.com') {
            throw new Error('Invalid response');
          }
        });

      await authRequest.del('/api/users/peter').expect(httpStatus.NO_CONTENT);
    });
  });

  describe('DELETE /api/users', () => {
    it('should fail when user was not found', async () => {
      await authRequest.del('/api/users/test').expect(httpStatus.NOT_FOUND);
    });

    it('should successfully delete user', async () => {
      await authRequest
        .put('/api/users')
        .send(users.hanna)
        .expect(httpStatus.CREATED);

      await authRequest.del('/api/users/hanna').expect(httpStatus.NO_CONTENT);

      await authRequest.get('/api/users/hanna').expect(httpStatus.NOT_FOUND);
    });
  });
});
