import httpStatus from 'http-status';
import request from 'supertest';

import { initializeDatabase } from './helpers/database';
import { closeRedis } from '~/server/services/redis';

import app from '~/server';

describe('API', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeRedis();
  });

  describe('GET /api', () => {
    it('should respond with a successful message', async () => {
      await request(app).get('/api').expect(httpStatus.OK, {
        status: 'ok',
      });
    });

    it('should respond with not found error on invalid routes', async () => {
      await request(app).get('/api/wrong').expect(httpStatus.NOT_FOUND);
    });
  });
});
