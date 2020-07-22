import httpStatus from 'http-status';
import request from 'supertest';

import createSupertest from './helpers/supertest';
import artistsData from './data/artists';
import artworksData from './data/artworks';
import { initializeDatabase } from './helpers/database';

import app from '~/server';

describe('Answers', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
    await authRequest.put('/api/artworks').send(artworksData.davinci);
  });

  afterAll(async () => {
    await authRequest.del('/api/artworks/mona-lisa');
    await authRequest.del('/api/artists/matthew-barney');
  });

  describe('PUT /api/artists', () => {
    it('should succeed creating an artist', async () => {
      await authRequest
        .put('/api/artists')
        .send(artistsData.me)
        .expect(httpStatus.CREATED);
    });

    it('should be able to link an artist to artwork', async () => {
      await authRequest
        .post('/api/artworks/mona-lisa')
        .send({
          ...artworksData.davinci,
          artistId: 1,
        })
        .expect(httpStatus.NO_CONTENT);
    });
  });

  describe('GET /api/artists', () => {
    it('should return artist with artworks', async () => {
      await request(app)
        .get('/api/artists/matthew-barney')
        .expect(httpStatus.OK)
        .expect((response) => {
          const { name, artworks } = response.body.data;
          expect(name).toBe(artistsData.me.name);
          expect(artworks[0].title).toBe(artworksData.davinci.title);
        });
    });
  });
});
