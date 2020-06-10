import httpStatus from 'http-status';
import request from 'supertest';

import createSupertest from './helpers/supertest';
import artworks from './data/artworks';
import answers from './data/answers';
import properties from './data/properties';
import { initializeDatabase } from './helpers/database';

import app from '~/server';

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
        .send(answers.artworkAnswer)
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

  describe('GET /api/artworks', () => {
    it('should return chainId when request is authenticated', async () => {
      await authRequest
        .get('/api/answers/1')
        .expect(httpStatus.OK)
        .expect((response) => {
          const answer = response.body.data;
          expect(answer.chainId).toBeDefined();
          expect(answer.type).toBe(answers.artworkAnswer.type);
          expect(answer.artworkId).toBe(answers.artworkAnswer.artworkId);
        });
    });

    it('should not return chainId when request is unauthenticated', async () => {
      await request(app)
        .get('/api/answers/1')
        .expect(httpStatus.OK)
        .expect((response) => {
          const answer = response.body.data;
          expect(answer.chainId).toBeUndefined();
          expect(answer.type).toBe(answers.artworkAnswer.type);
          expect(answer.artworkId).toBe(answers.artworkAnswer.artworkId);
        });
    });
  });
});
