import httpStatus from 'http-status';
import request from 'supertest';

import createSupertest from './helpers/supertest';
import artworks from './data/artworks';
import questions from './data/questions';
import answersData from './data/answers';
import { initializeDatabase } from './helpers/database';

import app from '~/server';

describe('Answers', () => {
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();
    await authRequest.put('/api/artworks').send(artworks.davinci);
    await authRequest.put('/api/answers').send(answersData.artworkAnswer);
  });

  afterAll(async () => {
    await authRequest.del('/api/artworks/mona-lisa');
    await authRequest.del('/api/answers/1');
  });

  describe('PUT /api/questions', () => {
    it('should succeeed creating a question an its resultant answers', async () => {
      const body = {
        ...questions['1'],
        answers: [{ id: 1 }],
      };
      await authRequest
        .put('/api/questions')
        .send(body)
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /api/questions', () => {
    it('should return the question and answer', async () => {
      const answer = await request(app).get('/api/answers/1');
      await request(app)
        .get('/api/questions/1')
        .expect(httpStatus.OK)
        .expect(response => {
          const { title, answers } = response.body.data;
          expect(title).toBe(questions['1'].title);
          expect(answers).toMatchObject([answer.body.data]);
        });
    });
  });
});
