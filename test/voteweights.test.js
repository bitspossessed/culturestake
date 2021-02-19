import httpStatus from 'http-status';
//import request from 'supertest';

import voteweights from './data/voteweights';
import createSupertest from './helpers/supertest';
import festivals from './data/festivals';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';

//import app from '~/server';

describe('Voteweights', () => {
  let authRequest;
  let festivalData;

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
});
