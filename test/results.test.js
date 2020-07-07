import request from 'supertest';
import httpStatus from 'http-status';

import { initializeDatabase } from './helpers/database';
import artworksData from './data/artworks';
import answersData from './data/answers';
import questionsData from './data/questions';
import festivalsData from './data/festivals';

import app from '~/server';
import web3 from '~/common/services/web3';
import {
  getAdminContract,
  getQuestionContract,
} from '~/common/services/contracts';
import createSupertest from './helpers/supertest';
import initQuestion from './helpers/initQuestion';
import initAnswer from './helpers/initAnswer';
import buildVote from './helpers/buildVote';

describe('API', () => {
  let authRequest;
  let answers;
  let admin;
  let question;
  let sender;
  let booth;
  let vote;

  beforeAll(async () => {
    // add test data
    await initializeDatabase();
    authRequest = await createSupertest();
    await authRequest.put('/api/artworks').send(artworksData.davinci);
    await authRequest.put('/api/artworks').send(artworksData.rothko);
    await authRequest.put('/api/artworks').send(artworksData.goya);
    await authRequest.put('/api/artworks').send(artworksData.bourgeois);
    await authRequest.put('/api/artworks').send(artworksData.martin);
    await authRequest.put('/api/festivals').send(festivalsData['1']);

    // set up question contract
    admin = getAdminContract(process.env.ADMIN_CONTRACT);
    const questionAddress = await initQuestion(admin, 'festival');
    question = getQuestionContract(questionAddress);

    // add question to api
    await authRequest.put('/api/questions').send({
      ...questionsData['1'],
      address: question.options.address,
    });

    // add answers to api
    await authRequest.put('/api/answers').send(answersData.artworkAnswer1);
    await authRequest.put('/api/answers').send(answersData.artworkAnswer2);
    await authRequest.put('/api/answers').send(answersData.artworkAnswer3);
    await authRequest.put('/api/answers').send(answersData.artworkAnswer4);
    await authRequest.put('/api/answers').send(answersData.artworkAnswer5);

    // use chainId from api to create answer on blockchain
    const answer1 = await initAnswer(question, 1);
    const answer2 = await initAnswer(question, 2);
    const answer3 = await initAnswer(question, 3);
    const answer4 = await initAnswer(question, 4);
    const answer5 = await initAnswer(question, 5);
    answers = [answer1, answer2, answer3, answer4, answer5];

    // create accounts for voting
    sender = web3.eth.accounts.create();
    booth = web3.eth.accounts.privateKeyToAccount(
      `0x${process.env.BOOTH_PRIV_KEY}`,
    );

    const answerIds = answers.map(a => a.id);
    const votes = [1, 2, 3, 4, 5];
    vote = buildVote(booth, sender, question, answerIds, votes);

    await request(app)
      .post('/api/vote')
      .send(vote);
  });

  afterAll(async () => {
    await authRequest.del('/api/artworks/mona-lisa');
    await authRequest.del('/api/artworks/untitled-black-and-grey');
    await authRequest.del('/api/artworks/saturn-devouring-his-son');
    await authRequest.del('/api/artworks/spider');
    await authRequest.del('/api/artworks/little-sister');
    await authRequest.del('/api/festivals/a-festival');
    await authRequest.del('/api/answers/1');
    await authRequest.del('/api/answers/2');
    await authRequest.del('/api/answers/3');
    await authRequest.del('/api/answers/4');
    await authRequest.del('/api/answers/5');
    await authRequest.del('/api/questions/1');
  });

  describe('GET /api/vote', () => {
    it('should return answer info for top three answers for public request', async (done) => {
      setTimeout(async () => {
        await request(app)
          .get(`/api/vote/${question.options.address}`)
          .expect(httpStatus.OK)
          .expect(response => {
            const summary = response.body.data;
            for (const a in summary.answers) {
              if (a.votePower >= 3) {
                expect(a.artworkId).toBeDefined();
              } else {
                expect(a.artworkId).toBeUndefined();
              }
            }
          })
          .then(done())
          .catch(err => done(err));
      }, 1000);
    });

    it('should return answer info for all answers for auth request', async done => {
      setTimeout(async () => {
        await authRequest
          .get(`/api/vote/${question.options.address}`)
          .expect(httpStatus.OK)
          .expect(response => {
            const summary = response.body.data;
            for (const a in summary.answers) {
              expect(a.artworkId).toBeDefined();
            }
          })
          .then(done())
          .catch(err => done(err));
      }, 1000);
    });
  });
});
