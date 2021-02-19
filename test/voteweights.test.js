import httpStatus from 'http-status';
import request from 'supertest';

import voteweights from './data/voteweights';
import createSupertest from './helpers/supertest';
import festivals from './data/festivals';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';

import app from '~/server';

describe('Voteweights', () => {
  let authRequest;
  let festivalData;
  let voteweightData;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();

    // Create test data
    festivalData = await put('/api/festivals', festivals.barbeque);
  });

  describe('PUT /api/voteweights', () => {
    it('should succeed creating a hotspot voteweight', async () => {
      await authRequest
        .put('/api/voteweights')
        .send({
          ...voteweights.hotspotVoteweight,
          festivalId: festivalData.id,
        })
        .expect(httpStatus.CREATED);
    });
  });

  describe('PUT /api/voteweights', () => {
    it('should succeed creating a location voteweight', async () => {
      await authRequest
        .put('/api/voteweights')
        .send({
          ...voteweights.locationVoteweight,
          festivalId: festivalData.id,
        })
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /api/voteweights', () => {
    beforeAll(async () => {
      voteweightData = await put('/api/voteweights', {
        ...voteweights.locationVoteweight,
        festivalId: festivalData.id,
      });
    });

    it('should return the question and answer', async () => {
      await request(app)
        .get(`/api/voteweights/${voteweightData.id}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const { latitude, longitude, strength, radius } = response.body.data;
          expect(strength).toBe(voteweights.locationVoteweight.strength);
          expect(radius).toBe(voteweights.locationVoteweight.radius);
          expect(latitude).toBe(voteweights.locationVoteweight.latitude);
          expect(longitude).toBe(voteweights.locationVoteweight.longitude);
        });
    });
  });
});
