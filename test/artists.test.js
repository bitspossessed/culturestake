import httpStatus from 'http-status';
import request from 'supertest';

import artistsData from './data/artists';
import artworksData from './data/artworks';
import createSupertest from './helpers/supertest';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';
import { closeRedis } from '~/server/services/redis';

import app from '~/server';

describe('Artists', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
  });

  afterAll(async () => {
    await closeRedis();
  });

  describe('PUT /api/artists', () => {
    it('should succeed creating an artist', async () => {
      await authRequest
        .put('/api/artists')
        .send(artistsData.me)
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /api/artists', () => {
    let artistData;

    beforeEach(async () => {
      artistData = await put('/api/artists', artistsData.you);
    });

    it('should return artist with artworks', async () => {
      const artworkData = await put('/api/artworks', {
        ...artworksData.davinci,
        artistId: artistData.id,
      });

      await request(app)
        .get(`/api/artists/${artistData.slug}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const { name, artworks } = response.body.data;
          expect(name).toBe(artistData.name);
          expect(artworks[0].title).toBe(artworkData.title);
        });
    });
  });
});
