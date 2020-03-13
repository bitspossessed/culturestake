import httpStatus from 'http-status';

import createSupertest from './helpers/supertest';
import artworks from './data/artworks';
import properties from './data/properties';
import { initializeDatabase } from './helpers/database';

describe('Answers', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
    await authRequest.put('/api/artworks').send(artworks.davinci);
    await authRequest.put('/api/properties').send(properties.aProperty);
  });

  afterAll(async () => {
    await authRequest.del('/api/artworks/mona-lisa');
    await authRequest.del('/api/properties/is-blue');
  });

  describe('PUT /api/artworks', () => {
    it('should succeeed creating a new answer for an artwork', async () => {
      await authRequest
        .put('/api/answers')
        .send({
          type: 'artwork',
          artworkId: 1,
        })
        .expect(httpStatus.CREATED);
    });

    it('should succeeed creating a new answer for a property', async () => {
      await authRequest
        .put('/api/answers')
        .send({
          type: 'property',
          propertyId: 1,
        })
        .expect(httpStatus.CREATED);
    });

  //   it('should fail when there is a duplicate entry', async () => {
  //     await authRequest
  //       .put('/api/users')
  //       .send(users.lisa)
  //       .expect(httpStatus.CREATED);

  //     await authRequest
  //       .put('/api/users')
  //       .send(users.lisa)
  //       .expect(httpStatus.CONFLICT);
  //   });
  // });

  // describe('GET /api/users', () => {
  //   let createdUsers = [];

  //   beforeEach(async () => {
  //     createdUsers = [];

  //     await Promise.all(
  //       [users.hanna, users.lisa, users.petra].map(async user => {
  //         return await authRequest
  //           .put('/api/users')
  //           .send(user)
  //           .expect(httpStatus.CREATED)
  //           .then(response => {
  //             createdUsers.push(response.body.data);
  //           });
  //       }),
  //     );
  //   });

  //   afterEach(async () => {
  //     await Promise.all(
  //       [users.hanna, users.lisa, users.petra].map(async user => {
  //         return await authRequest
  //           .del(`/api/users/${user.username}`)
  //           .expect(httpStatus.NO_CONTENT);
  //       }),
  //     );
  //   });

  //   it('should return all created users', async () => {
  //     await authRequest
  //       .get('/api/users')
  //       .expect(httpStatus.OK)
  //       .expect(response => {
  //         const { results } = response.body.data;

  //         createdUsers.forEach(user => {
  //           const foundUser = results.find(item => item.id === user.id);

  //           expect(foundUser).toBeDefined();
  //           expect(foundUser.email).toBe(user.email);
  //         });

  //         expect(results.length).toBe(Object.keys(users).length);
  //       });
  //   });
  // });

  // describe('UPDATE /api/users', () => {
  //   it('should fail when user was not found', async () => {
  //     await authRequest
  //       .post('/api/users/test', {
  //         username: 'bla',
  //       })
  //       .expect(httpStatus.NOT_FOUND);
  //   });

  //   it('should successfully change the username and email', async () => {
  //     await authRequest
  //       .put('/api/users')
  //       .send(users.petra)
  //       .expect(httpStatus.CREATED);

  //     await authRequest
  //       .post('/api/users/petra')
  //       .send({
  //         username: 'peter',
  //         email: 'peter@test.com',
  //       })
  //       .expect(httpStatus.NO_CONTENT);

  //     await authRequest
  //       .get('/api/users/peter')
  //       .expect(httpStatus.OK)
  //       .expect(response => {
  //         const { username, email } = response.body.data;

  //         expect(username).toBe('peter');
  //         expect(email).toBe('peter@test.com');
  //       });

  //     await authRequest.del('/api/users/peter').expect(httpStatus.NO_CONTENT);
  //   });
  // });

  // describe('DELETE /api/users', () => {
  //   it('should fail when user was not found', async () => {
  //     await authRequest.del('/api/users/test').expect(httpStatus.NOT_FOUND);
  //   });

  //   it('should successfully delete user', async () => {
  //     await authRequest
  //       .put('/api/users')
  //       .send(users.hanna)
  //       .expect(httpStatus.CREATED);

  //     await authRequest.del('/api/users/hanna').expect(httpStatus.NO_CONTENT);

  //     await authRequest.get('/api/users/hanna').expect(httpStatus.NOT_FOUND);
  //   });
  });
});
