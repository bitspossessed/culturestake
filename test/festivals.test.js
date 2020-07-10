import httpStatus from 'http-status';
import request from 'supertest';

import createSupertest from './helpers/supertest';
import festivalsData from './data/festivals';
import artworksData from './data/artworks';
import { initializeDatabase } from './helpers/database';

import app from '~/server';

describe('Festivals', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
    await authRequest.put('/api/artworks').send(artworksData.davinci);
  });

  afterAll(async () => {
    await authRequest.del('/api/artworks/mona-lisa');
    await authRequest.del('/api/festivals/a-festival');
  });

  describe('PUT /api/festivals', () => {
    it('should succeeed creating an festival', async () => {
      await authRequest
        .put('/api/festivals')
        .send(festivalsData['1'])
        .expect(httpStatus.CREATED);
    });

    it('should be able to link a festival to artwork', async () => {
      const artwork = await request(app).get('/api/artworks/mona-lisa');
      await authRequest
        .post('/api/festivals/a-festival')
        .send({
          ...festivalsData['1'],
          artworks: [artwork.body.data],
        })
        .expect(httpStatus.NO_CONTENT);
    });
  });

  describe('GET /api/a-festival', () => {
    it('should return artist with artworks', async () => {
      await request(app)
        .get('/api/festivals/a-festival')
        .expect(httpStatus.OK)
        .expect((response) => {
          const { title, artworks } = response.body.data;
          expect(title).toBe(festivalsData['1'].title);
          expect(artworks[0].title).toBe(artworksData.davinci.title);
        });
    });
  });
});
