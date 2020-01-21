import httpStatus from 'http-status';
import request from 'supertest';

import app from '~/server';

describe('API', () => {
  describe('GET /api', () => {
    it('should respond with a successful message', async () => {
      await request(app)
        .get('/api')
        .expect(httpStatus.OK, {
          status: 'ok',
        });
    });

    it('should respond with not found error on invalid routes', async () => {
      await request(app)
        .get('/api/wrong')
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
