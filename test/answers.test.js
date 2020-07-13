import httpStatus from 'http-status';
import request from 'supertest';

import createSupertest from './helpers/supertest';
import artworksData from './data/artworks';
import answersData from './data/answers';
import festivalsData from './data/festivals';
import questionsData from './data/questions';
import properties from './data/properties';
import { initializeDatabase } from './helpers/database';

import app from '~/server';

describe('Answers', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
    await authRequest.put('/api/artworks').send(artworksData.davinci);
    await authRequest.put('/api/properties').send(properties.aProperty);
    await authRequest.put('/api/festivals').send(festivalsData['1']);
    await authRequest.put('/api/questions').send(questionsData['1']);
    await authRequest.put('/api/questions').send(questionsData['2']);
  });

  afterAll(async () => {
    await authRequest.del('/api/artworks/mona-lisa');
    await authRequest.del('/api/properties/is-blue');
    await authRequest.del('/api/questions/1');
    await authRequest.del('/api/questions/2');
  });

  describe('PUT /api/artworks', () => {
    it('should succeeed creating a new answer for an artwork', async () => {
      await authRequest
        .put('/api/answers')
        .send(answersData.artworkAnswer1)
        .expect(httpStatus.CREATED);
    });

    it('should succeeed creating a new answer for a property', async () => {
      await authRequest
        .put('/api/answers')
        .send(answersData.propertyAnswer)
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
          expect(answer.type).toBe(answersData.artworkAnswer1.type);
          expect(answer.artworkId).toBe(answersData.artworkAnswer1.artworkId);
        });
    });

    it('should not return chainId when request is unauthenticated', async () => {
      await request(app)
        .get('/api/answers/1')
        .expect(httpStatus.OK)
        .expect((response) => {
          const answer = response.body.data;
          expect(answer.chainId).toBeUndefined();
          expect(answer.type).toBe(answersData.artworkAnswer1.type);
          expect(answer.artworkId).toBe(answersData.artworkAnswer1.artworkId);
        });
    });
  });
});
