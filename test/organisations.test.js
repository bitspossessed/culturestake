import httpStatus from 'http-status';
import request from 'supertest';

import organisationsData from './data/organisations';
import createSupertest from './helpers/supertest';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';
import { closeRedis } from '~/server/services/redis';

import app from '~/server';

describe('Organisations', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
  });

  afterAll(async () => {
    await closeRedis();
  });

  describe('PUT /api/organisations', () => {
    it('should succeed creating an organisation', async () => {
      await authRequest
        .put('/api/organisations')
        .send(organisationsData.collectivise)
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /api/organisations', () => {
    let organisationData;

    beforeEach(async () => {
      organisationData = await put(
        '/api/organisations',
        organisationsData.cooperate,
      );
    });

    it('should return organisation details', async () => {
      await request(app)
        .get(`/api/organisations/${organisationData.slug}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const { name, description } = response.body.data;
          expect(name).toBe(organisationData.name);
          expect(description).toBe(organisationData.description);
        });
    });
  });
});
