import httpStatus from 'http-status';
import request from 'supertest';

import { initializeDatabase } from './helpers/database';
import artworksData from './data/artworks';
import answersData from './data/answers';
import propertiesData from './data/properties';
import questionsData from './data/questions';
import festivalsData from './data/festivals';

import app from '~/server';
import web3 from '~/common/services/web3';
import {
  getAdminContract,
  getQuestionContract,
} from '~/common/services/contracts';
import createSupertest from './helpers/supertest';
import { packBooth, packVote } from '~/common/services/encoding';
import initQuestion from './helpers/initQuestion';
import initAnswer from './helpers/initAnswer';
import buildVote from './helpers/buildVote';
import { refreshNonce } from './helpers/utils';

describe('API', () => {
  let authRequest;
  let festivalAnswer;
  let artworkAnswer;
  let admin;
  let festivalQuestion;
  let artworkQuestion;
  let sender;
  let booth;
  let vote;

  beforeAll(async () => {
    // add test data
    await initializeDatabase();
    authRequest = await createSupertest();
    await authRequest.put('/api/artworks').send(artworksData.davinci);
    await authRequest.put('/api/festivals').send(festivalsData['1']);
    await authRequest.put('/api/properties').send(propertiesData.aProperty);

    // set up question contract
    admin = getAdminContract(process.env.ADMIN_CONTRACT);

    let questionAddress = await initQuestion(admin, 'festival');
    festivalQuestion = getQuestionContract(questionAddress);
    let questionData = {
      ...questionsData['1'],
      address: questionAddress,
    };
    await authRequest.put('/api/questions').send(questionData);

    // set up second question contract
    questionAddress = await initQuestion(admin, 'festival');
    artworkQuestion = getQuestionContract(questionAddress);
    questionData = {
      ...questionsData['2'],
      address: questionAddress,
    };
    await authRequest.put('/api/questions').send(questionData);

    // add answers to api
    await authRequest.put('/api/answers').send(answersData.artworkAnswer1);
    await authRequest.put('/api/answers').send(answersData.propertyAnswer);

    // use chainId from api to create answer on blockchain
    festivalAnswer = await initAnswer(festivalQuestion, 1);
    artworkAnswer = await initAnswer(artworkQuestion, 2);

    // accounts for voting
    sender = web3.eth.accounts.create();
    booth = web3.eth.accounts.privateKeyToAccount(
      `0x${process.env.BOOTH_PRIV_KEY}`,
    );

    const festivalAnswers = [festivalAnswer.id];
    const artworkAnswers = [artworkAnswer.id];
    const festivalVoteTokens = [1];
    const artworkVoteTokens = [1];
    vote = buildVote(booth, sender, {
      festivalQuestion,
      festivalAnswers,
      festivalVoteTokens,
      artworkQuestion,
      artworkAnswers,
      artworkVoteTokens,
    });
  });

  afterAll(async () => {
    await authRequest.del('/api/artworks/mona-lisa');
    await authRequest.del('/api/properties/is-blue');
    await authRequest.del('/api/answers/1');
    await authRequest.del('/api/answers/2');
    await authRequest.del('/api/questions/1');
    await authRequest.del('/api/questions/2');
    await authRequest.del('/api/festivals/a-festival');
  });

  describe('POST /api/vote', () => {
    it('should succesfully vote', async () => {
      await request(app).post('/api/vote').send(vote).expect(httpStatus.OK);
    });

    it('should return bad request when answer id not in database', async () => {
      vote.signature = web3.eth.accounts.sign(
        packVote([3], [1], [2], [2]),
        sender.privateKey,
      ).signature;
      vote.festivalAnswers = [3];
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when invalid booth', async () => {
      vote.booth = sender.address;
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when invalid booth signature', async () => {
      const falseBooth = web3.eth.accounts.create();
      const nonce = refreshNonce();
      vote.boothSignature = web3.eth.accounts.sign(
        packBooth([festivalAnswer.id], nonce),
        falseBooth.privateKey,
      ).signature;
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when invalid sender signature', async () => {
      const falseSender = web3.eth.accounts.create();
      vote.signature = web3.eth.accounts.sign(
        packVote([festivalAnswer.id], [1], [artworkAnswer.id], [1]),
        falseSender.privateKey,
      ).signature;
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when sender has already voted', async () => {
      await request(app).post('/api/vote').send(vote);
      vote.nonce = refreshNonce();
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when nonce has already been used', async () => {
      await request(app).post('/api/vote').send(vote);
      sender = web3.eth.accounts.create();
      vote.signature = web3.eth.accounts.sign(
        packVote([festivalAnswer.id], [1], [artworkAnswer.id], [1]),
        sender.privateKey,
      ).signature;
      vote.sender = sender.address;
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when invalid question', async () => {
      vote.question = web3.eth.accounts.create().address;
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when invalid festival', async () => {
      vote.festival = web3.utils.sha3('not a valid festival');
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when sending too many votes', async () => {
      vote.voteTokens = [1000];
      vote.signature = web3.eth.accounts.sign(
        packVote([festivalAnswer.id], vote.voteTokens, [artworkAnswer.id], [1]),
        sender.privateKey,
      ).signature;
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when sending too many vote items', async () => {
      vote.voteTokens = [1, 1];
      vote.signature = web3.eth.accounts.sign(
        packVote([festivalAnswer.id], vote.voteTokens, [artworkAnswer.id], [1]),
        sender.privateKey,
      ).signature;
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return bad request when sending duplicates in answers array', async () => {
      vote.voteTokens = [1, 1];
      vote.signature = web3.eth.accounts.sign(
        packVote(
          [festivalAnswer.id, festivalAnswer.id],
          vote.voteTokens,
          [artworkAnswer.id],
          [1],
        ),
        sender.privateKey,
      ).signature;
      await request(app)
        .post('/api/vote')
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
