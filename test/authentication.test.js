import httpStatus from 'http-status';
import request from 'supertest';

import createSupertest from './helpers/supertest';
import users from './data/users';

import app from '~/server';

describe('Authentication', () => {
  let authRequest;

  beforeAll(async () => {
    authRequest = await createSupertest();
  });

  describe('POST /api/auth', () => {
    beforeEach(async () => {
      await authRequest
        .put('/api/users')
        .send(users.lisa)
        .expect(httpStatus.CREATED);
    });

    afterEach(async () => {
      await authRequest.del('/api/users/lisa').expect(httpStatus.NO_CONTENT);
    });

    it('should fail when credentials are missing', async () => {
      await request(app)
        .post('/api/auth')
        .send({
          password: 'wrong',
        })
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should fail when password or email is wrong', async () => {
      await request(app)
        .post('/api/auth')
        .send({
          email: users.lisa.email,
          password: 'wrong',
        })
        .expect(httpStatus.UNAUTHORIZED);

      await request(app)
        .post('/api/auth')
        .send({
          email: 'test@wrong.com',
          password: users.lisa.password,
        })
        .expect(httpStatus.UNAUTHORIZED);
    });

    it('should return JWT token after successful authorization', async () => {
      let token;

      await request(app)
        .post('/api/auth')
        .send({
          email: users.lisa.email,
          password: users.lisa.password,
        })
        .expect(httpStatus.OK)
        .expect(response => {
          const { data } = response.body;

          if (!('token' in data)) {
            throw new Error('Token is missing');
          }

          token = data.token;
        });

      await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.OK);
    });

    it('should fail on protected route when JWT token is wrong', async () => {
      await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer 123456789wrongToken123456789')
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
