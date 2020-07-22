import httpStatus from 'http-status';
import request from 'supertest';

import artworksData from './data/artworks';
import buildVote from './helpers/buildVote';
import createSupertest from './helpers/supertest';
import festivalsData from './data/festivals';
import getAccount from './helpers/getAccount';
import propertyData from './data/properties';
import { initAnswer, initQuestion } from './helpers/transactions';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';

import app from '~/server';
import web3 from '~/common/services/web3';
import {
  adminContract,
  getQuestionContract,
} from '~/common/services/contracts';

describe('Vote results', () => {
  let vote;
  let festivalQuestionData;
  let artworkQuestionData;
  let authRequest;

  beforeAll(async () => {
    await initializeDatabase();
    authRequest = await createSupertest();

    // Add test data
    const artworkIds = await Promise.all(
      [
        artworksData.davinci,
        artworksData.rothko,
        artworksData.goya,
        artworksData.bourgeois,
      ].map(async (artwork) => {
        const data = await put('/api/artworks', artwork);
        return data.id;
      }),
    );

    const propertyIds = await Promise.all(
      [propertyData.aProperty, propertyData.anotherProperty].map(
        async (property) => {
          const data = await put('/api/properties', property);
          return data.id;
        },
      ),
    );

    const festivalData = await put('/api/festivals', festivalsData.barbeque);
    // Use chainId from contract migrations
    festivalData.chainId = web3.utils.sha3('festival');

    // Set up question contracts
    festivalQuestionData = await put('/api/questions', {
      title: 'What do you think about frogs?',
      festivalId: festivalData.id,
    });
    const festivalQuestionAddress = await initQuestion(
      adminContract,
      festivalQuestionData.chainId,
      festivalData.chainId,
    );
    const festivalQuestionContract = getQuestionContract(
      festivalQuestionAddress,
    );

    // Set up question contract
    artworkQuestionData = await put('/api/questions', {
      title: 'What aspect of this frogwork did you like and how much?',
      festivalId: festivalData.id,
      artworkId: artworkIds[0], // Create artwork question for Davinci
    });
    const artworkQuestionAddress = await initQuestion(
      adminContract,
      artworkQuestionData.chainId,
      festivalData.chainId,
    );
    const artworkQuestionContract = getQuestionContract(artworkQuestionAddress);

    // Add answers to API
    const festivalAnswerIds = [];
    for await (let artworkId of artworkIds) {
      // Create answer in local database
      const answerData = await put('/api/answers', {
        type: 'artwork',
        artworkId,
        questionId: festivalQuestionData.id,
      });

      // Use chainId from api to create answer on blockchain
      await initAnswer(festivalQuestionContract, answerData.chainId);

      // Store answer id
      festivalAnswerIds.push(answerData.id);
    }

    const artworkAnswerIds = [];
    for await (let propertyId of propertyIds) {
      // Create answer in local database
      const answerData = await put('/api/answers', {
        type: 'property',
        propertyId,
        questionId: artworkQuestionData.id,
      });

      // Use chainId from api to create answer on blockchain
      await initAnswer(artworkQuestionContract, answerData.chainId);

      // Store answer id
      artworkAnswerIds.push(answerData.id);
    }

    // Create accounts for voting
    const sender = getAccount(1);
    const booth = web3.eth.accounts.privateKeyToAccount(
      `0x${process.env.BOOTH_PRIV_KEY}`,
    );

    // Create the actual vote of an user
    vote = buildVote(booth, sender, {
      festivalQuestionId: festivalQuestionData.id,
      festivalAnswerIds,
      festivalVoteTokens: [11, 2, 3, 4], // Davinci wins!
      artworkQuestionId: artworkQuestionData.id,
      artworkAnswerIds,
      artworkVoteTokens: [9, 10],
    });

    await request(app).post('/api/votes').send(vote).expect(httpStatus.CREATED);

    // ... wait a little bit for changes to propagate
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  describe('GET /api/votes', () => {
    it('should return answer info for top three answers for public request', async () => {
      await request(app)
        .get(`/api/votes/${festivalQuestionData.slug}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const { data } = response.body;

          // Secret is not leaked
          expect(data.secret).toBeUndefined();

          // Show all answers, also the anonymized ones
          expect(data.answers.length).toBe(4);

          data.answers.forEach((answer) => {
            // Secret is not leaked
            expect(answer.secret).toBeUndefined();

            // Check if the correct answers are anonymized (non top 3)
            if (answer.votePower >= 3) {
              expect(answer.artworkId).toBeDefined();
            } else {
              expect(answer.artworkId).toBeUndefined();
            }
          });
        });
    });

    it('should return answer info for all answers for auth request', async () => {
      await authRequest
        .get(`/api/votes/${festivalQuestionData.slug}`)
        .expect(httpStatus.OK)
        .expect((response) => {
          // Authenticated users should see sensitive vote data as well
          const { answers } = response.body.data;
          answers.forEach((answer) => {
            expect(answer.artworkId).toBeDefined();
          });
        });
    });
  });
});
