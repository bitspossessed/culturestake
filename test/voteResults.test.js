import request from 'supertest';

import { initializeDatabase } from './helpers/database';
import artworksData from './data/artworks';
import answersData from './data/answers';
import questionsData from './data/questions';

import Answers from '~/server/models/answer';

import app from '~/server';
import web3 from '~/common/services/web3';
import {
  getAdminContract,
  getQuestionContract,
} from '~/common/services/contracts';
import createSupertest from './helpers/supertest';
import adminTx from './helpers/adminTx';
import initQuestion from './helpers/initQuestion';
import initAnswer from './helpers/initAnswer';
import buildVote from './helpers/buildVote';

describe('API', () => {
  let authRequest;
  let answer;
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

    // set up question contract
    admin = getAdminContract(process.env.ADMIN_CONTRACT);
    const questionAddress = await initQuestion(
      admin,
      'festival',
      'my question',
    );
    question = getQuestionContract(questionAddress);

    // add question to api
    await authRequest.put('/api/questions').send({
      ...questionsData['1'],
      address: question.options.address,
    });

    // add answer to api
    await authRequest.put('/api/answers').send(answersData.artworkAnswer);

    // use chainId from api to create answer on blockchain
    answer = await Answers.findByPk(1);
    const data = question.methods.initAnswer(answer.chainId).encodeABI();
    await adminTx(question, data);

    // create accounts for voting
    sender = web3.eth.accounts.create();
    booth = web3.eth.accounts.privateKeyToAccount(
      `0x${process.env.BOOTH_PRIV_KEY}`,
    );

    const answers = [answer.id];
    const votes = [1];
    vote = buildVote(booth, sender, question, answers, votes);

    await request(app)
      .post('/api/vote')
      .send(vote);
  });

  afterAll(async () => {
    await authRequest.del('/api/artworks/mona-lisa');
    await authRequest.del('/api/answers/1');
    await authRequest.del('/api/questions/1');
  });

  describe('GET /api/vote', () => {
    it('should succesfully vote', async () => {
      await request(app)
        .get(`/api/vote/${question.options.address}`)
        .then((res) => {
          console.log(res.body.data)
        });
    });
  });
});
