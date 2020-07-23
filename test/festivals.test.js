import httpStatus from 'http-status';
import request from 'supertest';

import artworksData from './data/artworks';
import createSupertest from './helpers/supertest';
import festivalsData from './data/festivals';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';

import app from '~/server';

describe('Festivals', () => {
  let artworkData;
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();

    // Create test data
    artworkData = await put('/api/artworks', artworksData.davinci);
  });

  describe('PUT /api/festivals', () => {
    it('should succeed creating a festival', async () => {
      await authRequest
        .put('/api/festivals')
        .send(festivalsData.barbeque)
        .expect(httpStatus.CREATED);
    });

    it('should be able to link a festival to artwork', async () => {
      const festivalData = await put('/api/festivals', festivalsData.barbeque);
      await authRequest
        .post(`/api/festivals/${festivalData.slug}`)
        .send({
          artworks: [artworkData],
          description: festivalData.description,
          documents: [],
          images: [],
          sticker: festivalData.sticker,
          title: festivalData.title,
          subtitle: festivalData.subtitle,
        })
        .expect(httpStatus.NO_CONTENT);
    });
  });

  describe('GET /api/a-festival', () => {
    it('should return artist with artworks', async () => {
      const festivalData = await put('/api/festivals', {
        ...festivalsData.barbeque,
        artworks: [artworkData],
      });
      await request(app)
        .get(`/api/festivals/${festivalData.slug}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const { title, artworks } = response.body.data;
          expect(title).toBe(festivalData.title);
          expect(artworks[0].title).toBe(artworkData.title);
        });
    });
  });
});
