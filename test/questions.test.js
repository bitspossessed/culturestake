import httpStatus from 'http-status';
import request from 'supertest';

import artworks from './data/artworks';
import createSupertest from './helpers/supertest';
import festivals from './data/festivals';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';

import app from '~/server';

describe('Questions', () => {
  let authRequest;
  let festivalData;
  let artworkData;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();

    // Create test data
    festivalData = await put('/api/festivals', festivals.barbeque);
    artworkData = await put('/api/artworks', artworks.davinci);
  });

  describe('PUT /api/questions', () => {
    it('should succeed creating a question', async () => {
      await authRequest
        .put('/api/questions')
        .send({
          title: 'What was your favorite artwork of this festival?',
          festivalId: festivalData.id,
        })
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /api/questions', () => {
    let questionData;
    let answerData;

    beforeAll(async () => {
      questionData = await put('/api/questions', {
        title: 'What is your favorite color?',
        festivalId: festivalData.id,
      });

      answerData = await put('/api/answers', {
        artworkId: artworkData.id,
        questionId: questionData.id,
      });
    });

    it('should return the question and answer', async () => {
      await request(app)
        .get(`/api/questions/${questionData.id}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const { title, answers } = response.body.data;
          expect(title).toBe(questionData.title);
<<<<<<< HEAD
=======
          expect(chainId).toBeDefined();
>>>>>>> aa041de1b8e3da9dc7e886dce495ba1400bebd4b
          expect(answers.length).toBe(1);
          expect(answers[0].id).toBe(answerData.id);
          expect(answers[0].chainId).toBeUndefined();
        });
    });
  });
});
