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
  });
});
