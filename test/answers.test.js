import httpStatus from 'http-status';
import request from 'supertest';

import artworksData from './data/artworks';
import createSupertest from './helpers/supertest';
import festivalsData from './data/festivals';
import properties from './data/properties';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';

import app from '~/server';

describe('Answers', () => {
  let artworkData;
  let authRequest;
  let festivalData;
  let propertyData;
  let questionData1;
  let questionData2;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();

    // Create test data
    festivalData = await put('/api/festivals', festivalsData.barbeque);

    artworkData = await put('/api/artworks', artworksData.davinci);
    propertyData = await put('/api/properties', properties.aProperty);

    questionData1 = await put('/api/questions', {
      title: 'Why is this necessary?',
      type: 'festival',
      festivalId: festivalData.id,
    });

    questionData2 = await put('/api/questions', {
      title: 'How many?',
      type: 'artwork',
      artworkId: artworkData.id,
      festivalId: festivalData.id,
    });
  });

  describe('PUT /api/artworks', () => {
    it('should succeed creating a new answer for an artwork', async () => {
      await authRequest
        .put('/api/answers')
        .send({
          artworkId: artworkData.id,
          questionId: questionData1.id,
        })
        .expect(httpStatus.CREATED);
    });

    it('should succeed creating a new answer for a property', async () => {
      await authRequest
        .put('/api/answers')
        .send({
          propertyId: propertyData.id,
          questionId: questionData2.id,
        })
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /api/artworks', () => {
    let answerData;

    beforeAll(async () => {
      answerData = await put('/api/answers', {
        propertyId: propertyData.id,
        questionId: questionData2.id,
      });
    });

    it('should return chainId when request is authenticated', async () => {
      await authRequest
        .get(`/api/answers/${answerData.id}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const answer = response.body.data;
          expect(answer.chainId).toBeDefined();
          expect(answer.type).toBe(answerData.type);
          expect(answer.artworkId).toBe(answerData.artworkId);
        });
    });

    it('should not return chainId when request is unauthenticated', async () => {
      await request(app)
        .get(`/api/answers/${answerData.id}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const answer = response.body.data;
          expect(answer.chainId).toBeUndefined();
          expect(answer.type).toBe(answerData.type);
          expect(answer.artworkId).toBe(answerData.artworkId);
        });
    });
  });
});
